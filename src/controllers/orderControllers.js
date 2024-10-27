import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import Order from '../models/order.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import razorpay from '../config/razorpay.config.js';
import config from '../config/env.config.js';
import sendEmail from '../services/sendEmail.js';
import { orderSortRules } from '../utils/sortRules.js';
import {
  sendResponse,
  getCurrentDate,
  generateHmacSha256,
  isBoolean,
} from '../utils/helperFunctions.js';
import {
  getOrderConfirmationEmail,
  getOrderCancellationEmail,
  getOrderDeletionEmail,
} from '../utils/emailTemplates.js';
import {
  GST,
  DISCOUNT_TYPES,
  PAGINATION,
  ORDER_STATUS,
  DELIVERY_OPTIONS,
} from '../constants/common.js';

// Allows users to place an order
export const createOrder = handleAsync(async (req, res) => {
  const { items, deliveryMode } = req.body;
  const { user, coupon } = req;

  const orderAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  let discount = 0;

  if (coupon) {
    const { discountType, flatDiscount, percentageDiscount } = coupon;

    if (discountType === DISCOUNT_TYPES.FLAT) {
      if (orderAmount < flatDiscount) {
        throw new CustomError(
          `Order amount must be at least ₹${flatDiscount} to apply this coupon`,
          400
        );
      }

      discount = flatDiscount;
    } else {
      discount = (percentageDiscount * orderAmount) / 100;
    }
  }

  const { SHIPPING_CHARGES: shippingCharges } = DELIVERY_OPTIONS.find(
    option => option.TYPE === deliveryMode
  );

  const taxAmount = (orderAmount - discount) * GST.RATE + shippingCharges * GST.RATE;
  const totalAmount = orderAmount - discount + shippingCharges + taxAmount;

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: 'INR',
    receipt: uuidv4(),
  });

  const order = await Order.create({
    _id: razorpayOrder.id,
    ...req.body,
    orderAmount,
    discount,
    shippingCharges,
    taxAmount,
    totalAmount,
    user: user._id,
  });

  sendResponse(res, 201, 'Order created successfully', { id: order._id });
});

// Confirms an order upon payment success
export const confirmOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;
  const { razorpayPaymentId, razorpaySignature } = req.body;
  const { user } = req;

  const order = await Order.findOne({ _id: orderId, isDeleted: false });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.isPaid) {
    throw new CustomError('This order has already been confirmed', 409);
  }

  const generatedSignature = generateHmacSha256(
    orderId + '|' + razorpayPaymentId,
    config.razorpay.keySecret
  );

  if (razorpaySignature !== generatedSignature) {
    throw new CustomError('Provided invalid signature', 400);
  }

  const { SHIPPING_TIME } = DELIVERY_OPTIONS.find(option => option.TYPE === order.deliveryMode);

  const confirmedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      isPaid: true,
      paymentId: razorpayPaymentId,
      estimatedDeliveryDate: addDays(
        getCurrentDate(),
        Math.ceil((SHIPPING_TIME.MIN + SHIPPING_TIME.MAX) / 2)
      ),
    },
    {
      runValidators: true,
      new: true,
    }
  )
    .populate('items.product')
    .populate('shippingAddress');

  user.cart = [];
  await user.save();

  await Promise.all(
    order.items.map(async item => {
      const product = await Product.findById(item.product);
      product.stock = product.stock - item.quantity;
      product.soldUnits = product.soldUnits + item.quantity;
      await product.save();
    })
  );

  try {
    const options = {
      recepient: user.email,
      subject: 'Order successfully placed',
      html: getOrderConfirmationEmail(user.firstname, confirmedOrder),
    };

    await sendEmail(options);
  } catch (error) {
    throw new CustomError('Failed to send order confirmation email to the user', 500);
  }

  sendResponse(res, 200, 'Order placed successfully', confirmedOrder);
});

// Allows users to fetch a paginated list of their orders
export const getOrders = handleAsync(async (req, res) => {
  const { daysInPast, page } = req.query;

  const filters = {
    user: req.user._id,
    createdAt: {
      $gt: new Date(getCurrentDate().getTime() - (daysInPast - 1) * 24 * 60 * 60 * 1000),
    },
    isPaid: true,
    isDeleted: false,
  };

  const sortRule = { createdAt: -1 };
  const offset = (page - 1) * PAGINATION.ORDERS_PER_PAGE;
  const limit = PAGINATION.ORDERS_PER_PAGE;

  const orders = await Order.find(filters)
    .sort(sortRule)
    .skip(offset)
    .limit(limit)
    .populate('items.product');

  const orderCount = await Order.countDocuments(filters);

  res.set('X-Total-Count', orderCount);

  sendResponse(res, 200, 'Orders fetched successfully', orders);
});

// Allows users to fetch one of their orders by ID
export const getOrderById = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, isPaid: true, isDeleted: false })
    .populate('items.product')
    .populate('shippingAddress');

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who placed this order can view it', 403);
  }

  sendResponse(res, 200, 'Order fetched by ID successfully', order);
});

// Allows users to cancel their order
export const cancelOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;
  const { user } = req;

  const order = await Order.findOne({ _id: orderId, isPaid: true, isDeleted: false });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who placed this order can cancel it', 403);
  }

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new CustomError('This order has already been cancelled', 409);
  }

  if (order.status === ORDER_STATUS.DELIVERED) {
    throw new CustomError('Delivered orders cannot be cancelled', 409);
  }

  const cancelledOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: ORDER_STATUS.CANCELLED },
    { runValidators: true, new: true }
  ).populate('items.product');

  await Promise.all(
    order.items.map(async item => {
      const product = await Product.findById(item.product);
      product.stock = product.stock + item.quantity;
      product.soldUnits = product.soldUnits - item.quantity;
      await product.save();
    })
  );

  await razorpay.payments.refund(cancelledOrder.paymentId, {
    amount: cancelledOrder.totalAmount * 100,
    speed: 'optimum',
    receipt: uuidv4(),
  });

  try {
    const options = {
      recipient: user.email,
      subject: 'Order successfully cancelled',
      html: getOrderCancellationEmail(user.firstname, cancelledOrder),
    };

    await sendEmail(options);
  } catch (error) {
    throw new CustomError('Failed to send order cancellation email to the user', 500);
  }

  sendResponse(res, 200, 'Order cancelled successfully', cancelledOrder);
});

// Allows admins to fetch a paginated list of orders
export const adminGetOrders = handleAsync(async (req, res) => {
  const { daysInPast, status, paid, sort, page } = req.query;

  const filters = {
    createdAt: { $gt: getCurrentDate().getTime() - (daysInPast - 1) * 24 * 60 * 60 * 1000 },
    isDeleted: false,
  };

  if (status.length > 0) {
    filters.status = { $in: status };
  }

  if (paid && isBoolean(paid)) {
    filters.isPaid = paid;
  }

  const sortRule = orderSortRules[sort];
  const offset = (page - 1) * PAGINATION.ORDERS_PER_PAGE;
  const limit = PAGINATION.ORDERS_PER_PAGE;

  const orders = await Order.find(filters)
    .sort(sortRule)
    .skip(offset)
    .limit(limit)
    .populate('items.product')
    .populate('shippingAddress');

  const orderCount = await Order.countDocuments(filters);

  res.set('X-Total-Count', orderCount);

  sendResponse(res, 200, 'Orders fetched successfully', orders);
});

// Allows admins to fetch an order by ID
export const adminGetOrderById = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, isDeleted: false })
    .populate('items.product')
    .populate('shippingAddress');

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  sendResponse(res, 200, 'Order fetched by ID successfully', order);
});

// Allows admins to update the status of an order
export const updateOrderStatus = handleAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatus = Object.values(ORDER_STATUS).filter(
    status => status !== ORDER_STATUS.CANCELLED
  );

  const order = await Order.findOne({ _id: orderId, isDeleted: false });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (!order.isPaid) {
    throw new CustomError('Cannot update status of an unpaid order', 403);
  }

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new CustomError('Cannot update status of a cancelled order', 403);
  }

  const currentStatusIndex = allowedStatus.indexOf(order.status);
  const newStatusIndex = allowedStatus.indexOf(status);

  if (order.status === status) {
    throw new CustomError(`This order is already marked as ${status}`, 409);
  }

  if (newStatusIndex < currentStatusIndex) {
    throw new CustomError(`Cannot change order status from ${order.status} back to ${status}`, 403);
  }

  if (newStatusIndex > currentStatusIndex + 1) {
    const validStatus = allowedStatus[currentStatusIndex + 1];

    throw new CustomError(
      `Order status must be updated to ${validStatus} before it can be changed to ${status}`,
      403
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      status,
      statusLastUpdatedBy: req.user._id,
      statusUpdatedAt: new Date(),
    },
    { runValidators: true, new: true }
  )
    .populate('items.product')
    .populate('shippingAddress');

  sendResponse(res, 200, 'Order status updated successfully', updatedOrder);
});

// Allows admins to delete an order
export const deleteOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, isDeleted: false },
    { isDeleted: true, deletedBy: req.user._id, deletedAt: new Date() },
    { runValidators: true }
  ).populate({
    path: 'user',
    select: { firstname: 1, email: 1 },
  });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (
    order.status === ORDER_STATUS.CREATED ||
    order.status === ORDER_STATUS.PROCESSING ||
    order.status === ORDER_STATUS.SHIPPED
  ) {
    await Promise.all(
      order.items.map(async item => {
        const product = await Product.findById(item.product);
        product.stock = product.stock + item.quantity;
        product.soldUnits = product.soldUnits - item.quantity;
        await product.save();
      })
    );

    await razorpay.payments.refund(order.paymentId, {
      amount: order.totalAmount * 100,
      speed: 'optimum',
      receipt: uuidv4(),
    });

    try {
      const options = {
        recipient: order.user.email,
        subject: 'Order deletion notification',
        html: getOrderDeletionEmail(order.user.firstname, order),
      };

      await sendEmail(options);
    } catch (error) {
      throw new CustomError('Failed to send order deletion email to the user', 500);
    }
  }

  sendResponse(res, 200, 'Order deleted successfully', { id: orderId });
});

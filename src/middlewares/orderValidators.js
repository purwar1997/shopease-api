import Product from '../models/product.js';
import Coupon from '../models/coupon.js';
import Address from '../models/address.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { COUPON_STATUS } from '../constants/common.js';

const removeDuplicateItems = orderItems => {
  const uniqueItems = {};

  for (const item of orderItems) {
    const id = item.product;

    if (uniqueItems[id]) {
      if (item.quantity > uniqueItems[id].quantity) {
        uniqueItems[id] = item;
      }
    } else {
      uniqueItems[id] = item;
    }
  }

  return Object.values(uniqueItems);
};

export const validateProducts = handleAsync(async (req, _res, next) => {
  let orderItems = removeDuplicateItems(req.body.items);

  orderItems = await Promise.all(
    orderItems.map(async item => {
      const { product: id, quantity } = item;

      const product = await Product.findOne({ _id: id, isDeleted: false });

      if (!product) {
        throw new CustomError(`Product by ID ${id} not found`, 404);
      }

      if (product.stock === 0) {
        throw new CustomError(`Product with ID ${id} is out of stock`, 409);
      }

      if (product.stock < quantity) {
        throw new CustomError(
          `Insufficient stock for product with ID ${id}. Available stock: ${product.stock}. Requested quantity: ${quantity}`,
          409
        );
      }

      return { ...item, price: product.price };
    })
  );

  req.body.items = orderItems;
  next();
});

export const validateCoupon = handleAsync(async (req, _res, next) => {
  const { couponCode } = req.body;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      throw new CustomError('Coupon does not exist', 404);
    }

    if (coupon.expiryDate < new Date() || coupon.status === COUPON_STATUS.INACTIVE) {
      throw new CustomError('Invalid coupon', 400);
    }

    req.coupon = coupon;
  }

  next();
});

export const validateAddress = handleAsync(async (req, _res, next) => {
  const { shippingAddress } = req.body;

  const address = await Address.findOne({ _id: shippingAddress, isDeleted: false });

  if (!address) {
    throw new CustomError('Shipping address not found', 404);
  }

  if (address.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who owns this address can use it', 403);
  }

  next();
});

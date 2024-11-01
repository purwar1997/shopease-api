import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  confirmOrder,
  cancelOrder,
  adminGetOrders,
  adminGetOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderControllers.js';
import {
  orderSchema,
  paymentInfoSchema,
  ordersQuerySchema,
  adminOrdersQuerySchema,
  orderStatusSchema,
  orderIdSchema,
} from '../schemas/orderSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import {
  validatePayload,
  validateQueryParams,
  validatePathParams,
} from '../middlewares/requestValidators.js';
import {
  validateProducts,
  validateCoupon,
  validateAddress,
} from '../middlewares/orderValidators.js';
import { ROLES } from '../constants/common.js';

const router = express.Router();

router
  .route('/orders')
  .all(isAuthenticated)
  .get(validateQueryParams(ordersQuerySchema), getOrders)
  .post(
    validatePayload(orderSchema),
    validateProducts,
    validateCoupon,
    validateAddress,
    createOrder
  );

router
  .route('/orders/:orderId')
  .get(isAuthenticated, validatePathParams(orderIdSchema), getOrderById);

router
  .route('/orders/:orderId/confirm')
  .put(
    isAuthenticated,
    validatePathParams(orderIdSchema),
    validatePayload(paymentInfoSchema),
    confirmOrder
  );

router
  .route('/orders/:orderId/cancel')
  .put(isAuthenticated, validatePathParams(orderIdSchema), cancelOrder);

router
  .route('/admin/orders')
  .get(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validateQueryParams(adminOrdersQuerySchema),
    adminGetOrders
  );

router
  .route('/admin/orders/:orderId')
  .all(isAuthenticated, authorizeRole(ROLES.ADMIN), validatePathParams(orderIdSchema))
  .get(adminGetOrderById)
  .put(validatePayload(orderStatusSchema), updateOrderStatus)
  .delete(deleteOrder);

export default router;

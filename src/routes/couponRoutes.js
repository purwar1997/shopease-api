import express from 'express';
import {
  getValidCoupons,
  checkCouponValidity,
  adminGetCoupons,
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  activateCoupon,
  deactivateCoupon,
} from '../controllers/couponControllers.js';
import {
  couponSchema,
  couponCodeSchema,
  couponsQuerySchema,
  couponIdSchema,
} from '../schemas/couponSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import {
  validatePayload,
  validateQueryParams,
  validatePathParams,
} from '../middlewares/requestValidators.js';
import { ROLES } from '../constants/common.js';

const router = express.Router();

router.route('/coupons').get(isAuthenticated, getValidCoupons);

router
  .route('/coupons/validity')
  .get(isAuthenticated, validateQueryParams(couponCodeSchema), checkCouponValidity);

router
  .route('/admin/coupons')
  .all(isAuthenticated, authorizeRole(ROLES.ADMIN))
  .get(validateQueryParams(couponsQuerySchema), adminGetCoupons)
  .post(validatePayload(couponSchema), createCoupon);

router
  .route('/admin/coupons/:couponId')
  .all(isAuthenticated, authorizeRole(ROLES.ADMIN), validatePathParams(couponIdSchema))
  .get(getCouponById)
  .put(validatePayload(couponSchema), updateCoupon)
  .delete(deleteCoupon);

router
  .route('/admin/coupons/:couponId/activate')
  .put(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(couponIdSchema),
    activateCoupon
  );

router
  .route('/admin/coupons/:couponId/deactivate')
  .put(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(couponIdSchema),
    deactivateCoupon
  );

export default router;

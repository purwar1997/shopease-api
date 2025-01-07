import Coupon from '../models/coupon.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse, getCurrentDate } from '../utils/helperFunctions.js';
import { couponSortRules } from '../utils/sortRules.js';
import { DISCOUNT_TYPES, COUPON_STATUS } from '../constants/common.js';

// Fetches a list of all valid coupons
export const getValidCoupons = handleAsync(async (_req, res) => {
  const coupons = await Coupon.find({
    expiryDate: { $gt: new Date() },
    status: COUPON_STATUS.ACTIVE,
  });

  sendResponse(res, 200, 'Valid coupons fetched successfully', coupons);
});

// Allows users to check the validity of a coupon
export const checkCouponValidity = handleAsync(async (req, res) => {
  const { couponCode } = req.query;

  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    throw new CustomError('Coupon does not exist', 404);
  }

  if (coupon.expiryDate < new Date() || coupon.status === COUPON_STATUS.INACTIVE) {
    throw new CustomError('Invalid coupon', 400);
  }

  sendResponse(res, 200, 'Provided coupon is valid', { isValid: true });
});

// Allows admins to fetch a paginated list of coupons
export const adminGetCoupons = handleAsync(async (req, res) => {
  const { daysUntilExpiration, discountType, status, sort, page, limit } = req.query;
  const filters = {};

  if (daysUntilExpiration) {
    filters.expiryDate = {
      $gt: new Date(),
      $lt: new Date(getCurrentDate().getTime() + daysUntilExpiration * 24 * 60 * 60 * 1000),
    };
  }

  if (discountType.length) {
    filters.discountType = { $in: discountType };
  }

  if (status.length) {
    filters.status = { $in: status };
  }

  const sortRule = sort ? couponSortRules[sort] : { createdAt: -1 };

  const coupons = await Coupon.find(filters)
    .sort(sortRule)
    .skip((page - 1) * limit)
    .limit(limit);

  const couponCount = await Coupon.countDocuments(filters);

  res.set('X-Total-Count', couponCount);

  sendResponse(res, 200, 'Coupons fetched successfully', coupons);
});

// Allows admins to create a new coupon
export const createCoupon = handleAsync(async (req, res) => {
  const { code } = req.body;

  const couponByCode = await Coupon.findOne({ code });

  if (couponByCode) {
    throw new CustomError(
      'Coupon by this code already exists. Please provide a different a coupon code',
      409
    );
  }

  const newCoupon = await Coupon.create({ ...req.body, createdBy: req.user._id });

  sendResponse(res, 201, 'Coupon created successfully', newCoupon);
});

// Allows admins to fetch a coupon by ID
export const getCouponById = handleAsync(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  sendResponse(res, 200, 'Coupon fetched by ID successfully', coupon);
});

// Allows admins to update a coupon
export const updateCoupon = handleAsync(async (req, res) => {
  const { couponId } = req.params;
  const { code, discountType, expiryDate } = req.body;

  let coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  const couponByCode = await Coupon.findOne({ code, _id: { $ne: couponId } });

  if (couponByCode) {
    throw new CustomError(
      'Coupon by this code already exists. Please provide a different coupon code',
      409
    );
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    {
      ...req.body,
      $unset:
        discountType === DISCOUNT_TYPES.FLAT ? { percentageDiscount: 1 } : { flatDiscount: 1 },
      status:
        coupon.expiryDate < new Date() && expiryDate > new Date()
          ? COUPON_STATUS.ACTIVE
          : coupon.status,
      lastUpdatedBy: req.user._id,
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Coupon updated successfully', updatedCoupon);
});

// Allows admins to delete a coupon
export const deleteCoupon = handleAsync(async (req, res) => {
  const { couponId } = req.params;

  const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

  if (!deletedCoupon) {
    throw new CustomError('Coupon not found', 404);
  }

  sendResponse(res, 200, 'Coupon deleted successfully', { id: couponId });
});

// Allows admins to activate a coupon
export const activateCoupon = handleAsync(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  if (coupon.expiryDate < new Date()) {
    throw new CustomError('Expired coupons cannot be activated', 403);
  }

  if (coupon.status === COUPON_STATUS.ACTIVE) {
    throw new CustomError('Coupon is already active', 409);
  }

  coupon.status = COUPON_STATUS.ACTIVE;
  coupon.activeStatusLastUpdatedBy = req.user._id;
  const activeCoupon = await coupon.save();

  sendResponse(res, 200, 'Coupon activated successfully', activeCoupon);
});

// Allows admins to deactivate a coupon
export const deactivateCoupon = handleAsync(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  if (coupon.expiryDate < new Date()) {
    throw new CustomError('Coupon has already been expired', 409);
  }

  if (coupon.status === COUPON_STATUS.INACTIVE) {
    throw new CustomError('Coupon is already inactive', 409);
  }

  coupon.status = COUPON_STATUS.INACTIVE;
  coupon.activeStatusLastUpdatedBy = req.user._id;
  const inactiveCoupon = await coupon.save();

  sendResponse(res, 200, 'Coupon deactivated successfully', inactiveCoupon);
});

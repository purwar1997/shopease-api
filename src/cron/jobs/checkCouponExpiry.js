import Coupon from '../../models/coupon.js';
import { COUPON_STATUS } from '../../constants/common.js';

export const checkCouponExpiry = async () => {
  try {
    await Coupon.updateMany(
      {
        expiryDate: { $lt: new Date() },
        status: { $ne: COUPON_STATUS.EXPIRED },
      },
      {
        status: COUPON_STATUS.EXPIRED,
      }
    );
  } catch (error) {
    console.log('Failed to check expiry date of coupons');
    console.error('ERROR:', error);
  }
};

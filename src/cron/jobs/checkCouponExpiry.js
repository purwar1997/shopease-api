import Coupon from '../../models/coupon.js';
import connectToDB from '../../db/index.js';
import { COUPON_STATUS } from '../../constants/common.js';

export const checkCouponExpiry = async () => {
  try {
    await connectToDB();

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
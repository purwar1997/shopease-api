import mongoose from 'mongoose';
import { formatOptions } from '../utils/helperFunctions.js';
import { REGEX } from '../constants/regexPatterns.js';
import { DISCOUNT_TYPES, DISCOUNT, COUPON_STATUS } from '../constants/common.js';

const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: [true, 'Coupon code is required'],
      match: [
        REGEX.COUPON_CODE,
        'Coupon code must be 5-15 characters long, start with a letter, and contain only uppercase letters and digits',
      ],
    },
    discountType: {
      type: String,
      required: [true, 'Discount type is required'],
      enum: {
        values: Object.values(DISCOUNT_TYPES),
        message: `Invalid discount type. Valid options are: ${formatOptions(DISCOUNT_TYPES)}`,
      },
    },
    flatDiscount: {
      type: Number,
      required: [
        function () {
          return this.discountType === DISCOUNT_TYPES.FLAT;
        },
        'Flat discount is required when discount type is flat',
      ],
      min: [DISCOUNT.MIN_FLAT, `Flat discount must be at least ₹${DISCOUNT.MIN_FLAT}`],
      max: [DISCOUNT.MAX_FLAT, `Flat discount must be at most ₹${DISCOUNT.MAX_FLAT}`],
      validate: {
        validator: discount => discount % DISCOUNT.FLAT_MULTIPLE === 0,
        message: `Flat discount must be a multiple of ${DISCOUNT.FLAT_MULTIPLE}`,
      },
    },
    percentageDiscount: {
      type: Number,
      required: [
        function () {
          return this.discountType === DISCOUNT_TYPES.PERCENTAGE;
        },
        'Percentage discount is required when discount type is percentage',
      ],
      min: [
        DISCOUNT.MIN_PERCENTAGE,
        `Percentage discount must be at least ${DISCOUNT.MIN_PERCENTAGE}%`,
      ],
      max: [
        DISCOUNT.MAX_PERCENTAGE,
        `Percentage discount must be at most ${DISCOUNT.MAX_PERCENTAGE}%`,
      ],
      validate: {
        validator: Number.isInteger,
        message: `Percentage discount must be an integer`,
      },
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      validate: {
        validator: date => date > new Date(),
        message: 'Expiry date must be in the future',
      },
    },
    status: {
      type: String,
      default: COUPON_STATUS.ACTIVE,
      enum: {
        values: Object.values(COUPON_STATUS),
        messages: `Invalid coupon status. Valid options are: ${formatOptions(COUPON_STATUS)}`,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who created this coupon is required'],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    activeStatusLastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
      transform: function (_doc, res) {
        res.id = res._id;
        delete res._id;
        return res;
      },
    },
  }
);

export default mongoose.model('Coupon', couponSchema);

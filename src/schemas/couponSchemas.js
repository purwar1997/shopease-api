import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { formatOptions } from '../utils/helperFunctions.js';
import {
  validateCommaSeparatedValues,
  validateOption,
  validateObjectId,
} from '../utils/joiValidators.js';
import { stripDiscountValue } from '../utils/joiSanitizers.js';
import { limitSchema, pageSchema } from './commonSchemas.js';
import { DISCOUNT_TYPES, DISCOUNT, COUPON_STATUS } from '../constants/common.js';
import { COUPON_SORT_OPTIONS } from '../constants/sortOptions.js';
import { COUPON_EXPIRATION } from '../constants/filterOptions.js';
import { REGEX } from '../constants/regexPatterns.js';

export const couponSchema = customJoi
  .object({
    code: Joi.string().trim().uppercase().pattern(REGEX.COUPON_CODE).required().messages({
      'any.required': 'Coupon code is required',
      'string.base': 'Coupon code must be a string',
      'string.empty': 'Coupon code cannot be empty',
      'string.pattern.base':
        'Coupon code must be 5-15 characters long, start with a letter, and contain only uppercase letters and digits',
    }),

    discountType: Joi.string()
      .trim()
      .lowercase()
      .required()
      .custom(validateOption(DISCOUNT_TYPES))
      .messages({
        'any.required': 'Discount type is required',
        'string.base': 'Discount type must be a string',
        'string.empty': 'Discount type cannot be empty',
        'any.invalid': `Invalid discount type. Valid options are: ${formatOptions(DISCOUNT_TYPES)}`,
      }),

    flatDiscount: Joi.when('discountType', {
      is: Joi.equal(DISCOUNT_TYPES.FLAT),
      then: Joi.number()
        .min(DISCOUNT.MIN_FLAT)
        .max(DISCOUNT.MAX_FLAT)
        .multiple(DISCOUNT.FLAT_MULTIPLE)
        .required(),
    }).messages({
      'any.required': 'Flat discount is required when discount type is flat',
      'number.base': 'Flat discount must be a number',
      'number.min': `Flat discount must be at least ₹${DISCOUNT.MIN_FLAT}`,
      'number.max': `Flat discount cannot exceed ₹${DISCOUNT.MAX_FLAT}`,
      'number.multiple': `Flat discount must be a multiple of ${DISCOUNT.FLAT_MULTIPLE}`,
      'number.unsafe': `Flat discount must be within a range of ₹${DISCOUNT.MIN_FLAT} and ₹${DISCOUNT.MAX_FLAT}`,
    }),

    percentageDiscount: Joi.when('discountType', {
      is: Joi.equal(DISCOUNT_TYPES.PERCENTAGE),
      then: Joi.number()
        .integer()
        .min(DISCOUNT.MIN_PERCENTAGE)
        .max(DISCOUNT.MAX_PERCENTAGE)
        .required(),
    }).messages({
      'any.required': 'Percentage discount is required when discount type is percentage',
      'number.base': 'Percentage discount must be a number',
      'number.integer': 'Percentage discount must be an integer',
      'number.min': `Percentage discount must be at least ${DISCOUNT.MIN_PERCENTAGE}%`,
      'number.max': `Percentage discount cannot exceed ${DISCOUNT.MAX_PERCENTAGE}%`,
      'number.unsafe': `Percentage discount must be within a range of ${DISCOUNT.MIN_PERCENTAGE}% and ${DISCOUNT.MAX_PERCENTAGE}%`,
    }),

    expiryDate: Joi.date().iso().greater('now').required().messages({
      'any.required': 'Expiry date is required',
      'date.base': 'Expiry date must be a valid date string',
      'date.format': 'Expiry date must be in ISO 8601 format',
      'date.greater': 'Expiry date must be in the future',
    }),
  })
  .custom(stripDiscountValue);

export const couponCodeSchema = Joi.object({
  couponCode: Joi.string().trim().uppercase().required().messages({
    'any.required': 'Coupon code is required',
    'string.base': 'Coupon code must be a string',
    'string.empty': 'Coupon code cannot be empty',
  }),
});

export const couponsQuerySchema = Joi.object({
  daysUntilExpiration: Joi.number()
    .integer()
    .min(COUPON_EXPIRATION.MIN)
    .empty('')
    .messages({
      'number.base': 'Days until expiration must be a number',
      'number.integer': 'Days until expiration must be an integer',
      'number.min': `Days until expiration must be at least ${COUPON_EXPIRATION.MIN}`,
      'number.unsafe': `Days until expiration must be within a range of ${COUPON_EXPIRATION.MIN} and ${COUPON_EXPIRATION.MAX}`,
    }),

  discountTypes: Joi.string()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(DISCOUNT_TYPES))
    .messages({
      'any.invalid': `One or more discount types are invalid. Valid discount types are: ${formatOptions(
        DISCOUNT_TYPES
      )}`,
    }),

  statuses: Joi.string()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(COUPON_STATUS))
    .messages({
      'any.invalid': `One or more coupon statuses are invalid. Valid statuses are: ${formatOptions(
        COUPON_STATUS
      )}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(COUPON_SORT_OPTIONS))
    .allow('')
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid value for sort. Valid options are: ${formatOptions(
        COUPON_SORT_OPTIONS
      )}`,
    }),

  page: pageSchema,
  limit: limitSchema,
});

export const couponIdSchema = Joi.object({
  couponId: Joi.string().trim().empty(':couponId').custom(validateObjectId).required().messages({
    'any.required': 'Coupon ID is required',
    'string.empty': 'Coupon ID cannot be empty',
    'any.invalid': 'Coupon ID is invalid. Expected a valid ObjectId',
  }),
});

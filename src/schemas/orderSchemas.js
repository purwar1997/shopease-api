import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { limitSchema, pageSchema } from './commonSchemas.js';
import { formatOptions } from '../utils/helperFunctions.js';
import { stripEmptyKeys } from '../utils/joiSanitizers.js';
import {
  validateObjectId,
  validateOption,
  validateCommaSeparatedValues,
} from '../utils/joiValidators.js';
import { QUANTITY, ORDER_STATUS, DELIVERY_MODES } from '../constants/common.js';
import { ORDER_SORT_OPTIONS } from '../constants/sortOptions.js';
import { ORDER_DURATION, ACTIVE_FILTER } from '../constants/filterOptions.js';

const allowedStatusForUpdate = { ...ORDER_STATUS };
delete allowedStatusForUpdate.CREATED;
delete allowedStatusForUpdate.CANCELLED;

const daysInPastSchema = Joi.number()
  .integer()
  .min(ORDER_DURATION.MIN)
  .empty('')
  .default(ORDER_DURATION.DEFAULT)
  .messages({
    'number.base': 'Days in past must be a number',
    'number.integer': 'Days in past must be an integer',
    'number.min': `Days in past must be at least ${ORDER_DURATION.MIN}`,
    'number.unsafe': `Days in past must be within a range of ${ORDER_DURATION.MIN} and ${ORDER_DURATION.MAX}`,
  });

const orderItemSchema = Joi.object({
  product: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product is required',
    'string.base': 'Product must be a string',
    'string.empty': 'Product cannot be empty',
    'any.invalid': 'Invalid value for product. Expected a valid ObjectId',
  }),

  quantity: Joi.number()
    .integer()
    .min(QUANTITY.MIN)
    .max(QUANTITY.MAX)
    .required()
    .messages({
      'any.required': 'Quantity is required',
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': `Quantity must be at least ${QUANTITY.MIN}`,
      'number.max': `Quantity cannot exceed ${QUANTITY.MAX}`,
      'number.unsafe': `Quantity must be within a range of ${QUANTITY.MIN} and ${QUANTITY.MAX}`,
    }),
}).messages({
  'object.base': 'Each order item must be an object with product and quantity fields',
});

export const orderSchema = customJoi
  .object({
    items: Joi.array()
      .items(orderItemSchema)
      .min(1)
      .required()
      .messages({
        'any.required': 'Order items are required',
        'array.base': 'Order items must be an array',
        'array.min': 'Items array must have at least one order item',
        'array.sparse': 'Undefined values are not allowed in items array',
      })
      .options({ abortEarly: true }),

    couponCode: Joi.string().trim().uppercase().allow('').messages({
      'string.base': 'Coupon code must be a string',
    }),

    shippingAddress: Joi.string().trim().required().custom(validateObjectId).messages({
      'any.required': 'Shipping address is required',
      'string.base': 'Shipping address must be a string',
      'string.empty': 'Shipping address cannot be empty',
      'any.invalid': 'Invalid value for shipping address. Expected a valid ObjectId',
    }),

    deliveryMode: Joi.string()
      .trim()
      .lowercase()
      .required()
      .custom(validateOption(DELIVERY_MODES))
      .messages({
        'any.required': 'Delivery mode is required',
        'string.base': 'Delivery mode must be a string',
        'string.empty': 'Delivery mode cannot be empty',
        'any.invalid': `Invalid delivery mode. Valid options are: ${formatOptions(DELIVERY_MODES)}`,
      }),
  })
  .custom(stripEmptyKeys);

export const paymentInfoSchema = customJoi.object({
  razorpayPaymentId: Joi.string().trim().required().messages({
    'any.required': 'Payment ID is required',
    'string.base': 'Payment ID must be a string',
    'string.empty': 'Payment ID cannot be empty',
  }),

  razorpaySignature: Joi.string().trim().required().messages({
    'any.required': 'Razorpay signature is required',
    'string.base': 'Razorpay signature must be a string',
    'string.empty': 'Razorpay signature cannot be empty',
  }),
});

export const ordersQuerySchema = Joi.object({
  daysInPast: daysInPastSchema,
  page: pageSchema,
  limit: limitSchema,
});

export const adminOrdersQuerySchema = Joi.object({
  daysInPast: daysInPastSchema,

  status: Joi.string()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(ORDER_STATUS))
    .messages({
      'any.invalid': `One or more order statuses are invalid. Valid statuses are: ${formatOptions(
        ORDER_STATUS
      )}`,
    }),

  paid: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ACTIVE_FILTER))
    .empty('')
    .default(ACTIVE_FILTER.ALL)
    .messages({
      'string.base': 'Paid must be a string',
      'any.only': `Invalid value for paid. Valid options are: ${formatOptions(ACTIVE_FILTER)}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ORDER_SORT_OPTIONS))
    .empty('')
    .default(ORDER_SORT_OPTIONS.DATE_DESC)
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid value for sort. Valid options are: ${formatOptions(ORDER_SORT_OPTIONS)}`,
    }),

  page: pageSchema,
  limit: limitSchema,
});

export const orderStatusSchema = customJoi.object({
  status: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateOption(allowedStatusForUpdate))
    .messages({
      'any.required': 'Order status is required',
      'string.base': 'Order status must be a string',
      'string.empty': 'Order status cannot be empty',
      'any.invalid': `Invalid order status. Valid options are: ${formatOptions(
        allowedStatusForUpdate
      )}`,
    }),
});

export const orderIdSchema = Joi.object({
  orderId: Joi.string().trim().empty(':orderId').required().messages({
    'any.required': 'Order ID is required',
    'string.empty': 'Order ID cannot be empty',
  }),
});

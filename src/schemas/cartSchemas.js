import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { validateObjectId } from '../utils/joiValidators.js';
import { QUANTITY } from '../constants/common.js';

export const productIdSchema = customJoi.object({
  productId: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product ID is required',
    'string.base': 'Product ID must be a string',
    'string.empty': 'Product ID cannot be empty',
    'any.invalid': 'Product ID is invalid. Expected a valid ObjectId',
  }),
});

export const updateQuantitySchema = customJoi.object({
  productId: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product ID is required',
    'string.base': 'Product ID must be a string',
    'string.empty': 'Product ID cannot be empty',
    'any.invalid': 'Product ID is invalid. Expected a valid ObjectId',
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
});

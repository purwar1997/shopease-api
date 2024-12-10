import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { validateObjectId } from '../utils/joiValidators.js';
import { QUANTITY } from '../constants/common.js';

export const productIdSchema = customJoi.object({
  productId: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product ID is required',
    'string.base': 'Product ID must be a string',
    'string.empty': 'Product ID cannot be empty',
    'any.invalid': 'Invalid ID format. Expected a valid objectId',
  }),
});

export const updateQuantitySchema = customJoi.object({
  productId: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product ID is required',
    'string.base': 'Product ID must be a string',
    'string.empty': 'Product ID cannot be empty',
    'any.invalid': 'Invalid ID format. Expected a valid objectId',
  }),

  quantity: Joi.number()
    .integer()
    .min(QUANTITY.MIN)
    .max(QUANTITY.MAX)
    .unsafe()
    .required()
    .messages({
      'any.required': 'Quantity is required',
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': `Quantity must be at least ${QUANTITY.MIN}`,
      'number.max': `Quantity must be at most ${QUANTITY.MAX}`,
    }),
});

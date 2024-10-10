import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { removeExtraInnerSpaces } from '../utils/joiSanitizers.js';
import { getPathIDSchema } from './commonSchemas.js';

export const brandSchema = customJoi.object({
  name: Joi.string().trim().max(50).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Brand name is required',
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name cannot be empty',
    'string.max': 'Brand name cannot exceed 50 characters',
  }),
});

export const brandIdSchema = Joi.object({
  brandId: getPathIDSchema('Brand ID', ':brandId'),
});
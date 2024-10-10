import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { removeExtraInnerSpaces } from '../utils/joiSanitizers.js';
import { getPathIDSchema } from './commonSchemas.js';

export const categorySchema = customJoi.object({
  title: Joi.string().trim().max(50).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Category title is required',
    'string.base': 'Category title must be a string',
    'string.empty': 'Category title cannot be empty',
    'string.max': 'Category title cannot exceed 50 characters',
  }),
});

export const categoryIdSchema = Joi.object({
  categoryId: getPathIDSchema('Category ID', ':categoryId'),
});
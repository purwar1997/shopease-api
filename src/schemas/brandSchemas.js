import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { removeExtraInnerSpaces } from '../utils/joiSanitizers.js';
import { validateObjectId } from '../utils/joiValidators.js';

export const brandSchema = customJoi.object({
  name: Joi.string().trim().max(50).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Brand name is required',
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name cannot be empty',
    'string.max': 'Brand name cannot exceed 50 characters',
  }),
});

export const brandIdSchema = Joi.object({
  brandId: Joi.string().trim().empty(':brandId').custom(validateObjectId).required().messages({
    'any.required': 'Brand ID is required',
    'string.empty': 'Brand ID cannot be empty',
    'any.invalid': 'Brand ID is invalid. Expected a valid objectId',
  }),
});

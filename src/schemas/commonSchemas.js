import Joi from 'joi';
import { validateObjectId } from '../utils/joiValidators.js';
import { SAFE_INTEGER } from '../constants/common.js';

export const getPathIDSchema = (name, value) =>
  Joi.string()
    .trim()
    .empty(value)
    .custom(validateObjectId)
    .required()
    .messages({
      'any.required': `${name} is required`,
      'string.empty': `${name} cannot be empty`,
      'any.invalid': `${name} is invalid. Expected a valid objectId`,
    });

export const getPathParamSchema = (name, value) =>
  Joi.string()
    .trim()
    .empty(value)
    .messages({
      'any.required': `${name} is required`,
      'string.empty': `${name} cannot be empty`,
    });

export const pageSchema = Joi.number()
  .integer()
  .min(1)
  .max(SAFE_INTEGER.MAX)
  .empty('')
  .default(1)
  .unsafe()
  .messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
    'number.max': `Page must be less than or equal to ${SAFE_INTEGER.MAX}`,
  });
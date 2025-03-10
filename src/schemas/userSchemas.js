import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { formatOptions } from '../utils/helperFunctions.js';
import {
  validateOption,
  validateObjectId,
  validateCommaSeparatedValues,
} from '../utils/joiValidators.js';
import { stripObjectKeys } from '../utils/joiSanitizers.js';
import { limitSchema, pageSchema } from './commonSchemas.js';
import { ROLES } from '../constants/common.js';
import { USER_SORT_OPTIONS } from '../constants/sortOptions.js';
import { REGEX } from '../constants/regexPatterns.js';

export const userSchema = customJoi
  .object({
    firstname: Joi.string().trim().pattern(REGEX.NAME).max(50).required().messages({
      'any.required': 'First name is required',
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'string.pattern.base': 'First name must contain only letters',
      'string.max': 'First name cannot exceed 50 characters',
    }),

    lastname: Joi.string().trim().pattern(REGEX.NAME).max(50).allow('').messages({
      'string.base': 'Last name must be a string',
      'string.pattern.base': 'Last name must contain only letters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),

    phone: Joi.string().trim().pattern(REGEX.PHONE).required().messages({
      'any.required': 'Phone number is required',
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base': 'Please provide a valid phone number',
    }),

    password: Joi.string().pattern(REGEX.PASSWORD).allow('').messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be 6-20 characters long and should contain at least one digit, one letter, and one special character',
    }),

    confirmPassword: Joi.any().valid(Joi.ref('password')).messages({
      'any.only': 'Confirm password does not match with password',
    }),
  })
  .with('password', 'confirmPassword')
  .custom(stripObjectKeys('confirmPassword'))
  .messages({
    'object.with': 'Confirm password is required',
  });

export const userRoleSchema = customJoi.object({
  role: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateOption(ROLES))
    .messages({
      'any.required': 'Role is required',
      'string.base': 'Role must be a string',
      'string.empty': 'Role cannot be empty',
      'any.invalid': `Invalid role. Valid options are: ${formatOptions(ROLES)}`,
    }),
});

export const usersQuerySchema = Joi.object({
  roles: Joi.string()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(ROLES))
    .messages({
      'any.invalid': `One or more roles are invalid. Valid roles are: ${formatOptions(ROLES)}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(USER_SORT_OPTIONS))
    .allow('')
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid value for sort. Valid options are: ${formatOptions(USER_SORT_OPTIONS)}`,
    }),

  page: pageSchema,
  limit: limitSchema,
});

export const userIdSchema = Joi.object({
  userId: Joi.string().trim().empty(':userId').custom(validateObjectId).required().messages({
    'any.required': 'User ID is required',
    'string.empty': 'User ID cannot be empty',
    'any.invalid': 'User ID is invalid. Expected a valid ObjectId',
  }),
});

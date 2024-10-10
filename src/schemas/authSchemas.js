import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { getPathParamSchema } from './commonSchemas.js';
import { REGEX } from '../constants/regexPatterns.js';

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ maxDomainSegments: 2, tlds: { allow: false } })
  .required()
  .messages({
    'any.required': 'Email address is required',
    'string.base': 'Email address must be a string',
    'string.empty': 'Email address cannot be empty',
    'string.email': 'Please provide a valid email address',
  });

const passwordSchema = Joi.string().pattern(REGEX.PASSWORD).required().messages({
  'any.required': 'Password is required',
  'string.base': 'Password must be string',
  'string.empty': 'Password cannot be empty',
  'string.pattern.base':
    'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
});

const confirmPasswordSchema = Joi.any().valid(Joi.ref('password')).required().strip().messages({
  'any.required': 'Confirm password is required',
  'any.only': "Confirm password doesn't match with password",
});

export const signupSchema = customJoi.object({
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

  email: emailSchema,

  phone: Joi.string().trim().pattern(REGEX.PHONE).required().messages({
    'any.required': 'Phone number is required',
    'string.base': 'Phone number must be a string',
    'string.empty': 'Phone number cannot be empty',
    'string.pattern.base': 'Please provide a valid phone number',
  }),

  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const loginSchema = customJoi.object({
  email: emailSchema,

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
  }),
});

export const forgotPasswordSchema = customJoi.object({
  email: emailSchema,
});

export const resetPasswordSchema = customJoi.object({
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const tokenSchema = Joi.object({
  token: getPathParamSchema('Reset password token', ':token'),
});
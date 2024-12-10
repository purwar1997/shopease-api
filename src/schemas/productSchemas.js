import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { formatOptions } from '../utils/helperFunctions.js';
import {
  roundToTwoDecimalPlaces,
  removeExtraInnerSpaces,
  sanitizeCommaSeparatedValues,
} from '../utils/joiSanitizers.js';
import { validateObjectId, validateOption } from '../utils/joiValidators.js';
import { pageSchema, getPathIDSchema } from './commonSchemas.js';
import { PRICE, STOCK, RATING } from '../constants/common.js';
import { PRODUCT_SORT_OPTIONS, ADMIN_PRODUCT_SORT_OPTIONS } from '../constants/sortOptions.js';
import { FILTER_OPTIONS } from '../constants/filterOptions.js';

const categoriesSchema = Joi.string()
  .trim()
  .empty('')
  .default([])
  .custom(sanitizeCommaSeparatedValues)
  .messages({
    'string.base': 'Categories must be a string',
  });

const brandsSchema = Joi.string()
  .trim()
  .empty('')
  .default([])
  .custom(sanitizeCommaSeparatedValues)
  .messages({
    'string.base': 'Brands must be a string',
  });

const ratingSchema = Joi.number()
  .integer()
  .min(RATING.MIN)
  .max(RATING.MAX)
  .empty('')
  .unsafe()
  .messages({
    'number.base': 'Rating must be a number',
    'number.integer': 'Rating must be an integer',
    'number.min': `Rating must be at least ${RATING.MIN}`,
    'number.max': `Rating must be at most ${RATING.MAX}`,
  });

export const productSchema = customJoi.object({
  title: Joi.string().trim().max(100).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Product title is required',
    'string.empty': 'Product title cannot be empty',
    'string.base': 'Product title must be a string',
    'string.max': 'Product title cannot exceed 100 characters',
  }),

  description: Joi.string().trim().max(500).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Product description is required',
    'string.empty': 'Product description cannot be empty',
    'string.base': 'Product description must be a string',
    'string.max': 'Product description cannot exceed 500 characters',
  }),

  price: Joi.number()
    .min(PRICE.MIN)
    .max(PRICE.MAX)
    .required()
    .unsafe()
    .custom(roundToTwoDecimalPlaces)
    .messages({
      'any.required': 'Product price is required',
      'number.base': 'Price must be a number',
      'number.min': `Products priced below ₹${PRICE.MIN} cannot be listed`,
      'number.max': `Products priced above ₹${PRICE.MAX} cannot be listed`,
    }),

  brand: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product brand is required',
    'string.empty': 'Product brand cannot be empty',
    'string.base': 'Product brand must be a string',
    'any.invalid': 'Invalid value provided for brand. Expected a valid objectId',
  }),

  category: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product category is required',
    'string.empty': 'Product category cannot be empty',
    'string.base': 'Product category must be a string',
    'any.invalid': 'Invalid value provided for category. Expected a valid objectId',
  }),

  stock: Joi.number()
    .integer()
    .min(STOCK.MIN)
    .max(STOCK.MAX)
    .required()
    .unsafe()
    .messages({
      'any.required': 'Product stock is required',
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': `Stock must be greater than or equal to ${STOCK.MIN}`,
      'number.max': `Stock cannot exceed ${STOCK.MAX} units`,
    }),
});

export const productsQuerySchema = Joi.object({
  categories: categoriesSchema,
  brands: brandsSchema,
  rating: ratingSchema,

  sort: Joi.string()
    .trim()
    .lowercase()
    .empty('')
    .default(PRODUCT_SORT_OPTIONS.RECOMMENDED)
    .custom(validateOption(PRODUCT_SORT_OPTIONS))
    .messages({
      'string.base': 'Sort option must be a string',
      'any.invalid': `Provided an invalid sort value. Valid options are: ${formatOptions(
        PRODUCT_SORT_OPTIONS
      )}`,
    }),

  page: pageSchema,
});

export const adminProductsQuerySchema = Joi.object({
  categories: categoriesSchema,
  brands: brandsSchema,
  rating: ratingSchema,

  availability: Joi.string()
    .trim()
    .lowercase()
    .allow('')
    .custom(validateOption(FILTER_OPTIONS))
    .messages({
      'string.base': 'Availability must be a string',
      'any.invalid': `Provided an invalid value for availability. Valid options are: ${formatOptions(
        FILTER_OPTIONS
      )}`,
    }),

  deleted: Joi.string()
    .trim()
    .lowercase()
    .allow('')
    .custom(validateOption(FILTER_OPTIONS))
    .messages({
      'string.base': 'Deleted must be a string',
      'any.invalid': `Provided an invalid value for deleted. Valid options are: ${formatOptions(
        FILTER_OPTIONS
      )}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .empty('')
    .default(ADMIN_PRODUCT_SORT_OPTIONS.NEWLY_ADDED)
    .custom(validateOption(ADMIN_PRODUCT_SORT_OPTIONS))
    .messages({
      'string.base': 'Sort option must be a string',
      'any.invalid': `Provided an invalid sort value. Valid options are: ${formatOptions(
        ADMIN_PRODUCT_SORT_OPTIONS
      )}`,
    }),

  page: pageSchema,
});

export const productIdSchema = Joi.object({
  productId: getPathIDSchema('Product ID', ':productId'),
});

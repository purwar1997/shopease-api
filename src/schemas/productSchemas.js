import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { formatOptions } from '../utils/helperFunctions.js';
import {
  roundToTwoDecimalPlaces,
  removeExtraInnerSpaces,
  parseCommaSeparatedValues,
} from '../utils/joiSanitizers.js';
import { validateObjectId } from '../utils/joiValidators.js';
import { limitSchema, pageSchema } from './commonSchemas.js';
import { PRICE, STOCK, RATING } from '../constants/common.js';
import { PRODUCT_SORT_OPTIONS, ADMIN_PRODUCT_SORT_OPTIONS } from '../constants/sortOptions.js';
import { ACTIVE_FILTER } from '../constants/filterOptions.js';

const categoriesSchema = Joi.string().empty('').default([]).custom(parseCommaSeparatedValues);
const brandsSchema = Joi.string().empty('').default([]).custom(parseCommaSeparatedValues);

const ratingSchema = Joi.number()
  .integer()
  .min(RATING.MIN)
  .max(RATING.MAX)
  .messages({
    'number.base': 'Rating must be a number',
    'number.integer': 'Rating must be an integer',
    'number.min': `Rating must be at least ${RATING.MIN}`,
    'number.max': `Rating cannot exceed ${RATING.MAX}`,
    'number.unsafe': `Rating must be within a range of ${RATING.MIN} and ${RATING.MAX}`,
  });

export const productSchema = customJoi.object({
  title: Joi.string().trim().max(100).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Product title is required',
    'string.base': 'Product title must be a string',
    'string.empty': 'Product title cannot be empty',
    'string.max': 'Product title cannot exceed 100 characters',
  }),

  description: Joi.string().trim().max(500).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Product description is required',
    'string.base': 'Product description must be a string',
    'string.empty': 'Product description cannot be empty',
    'string.max': 'Product description cannot exceed 500 characters',
  }),

  price: Joi.number()
    .min(PRICE.MIN)
    .max(PRICE.MAX)
    .required()
    .custom(roundToTwoDecimalPlaces)
    .messages({
      'any.required': 'Product price is required',
      'number.base': 'Price must be a number',
      'number.min': `Products priced below ₹${PRICE.MIN} cannot be listed`,
      'number.max': `Products priced above ₹${PRICE.MAX} cannot be listed`,
      'number.unsafe': `Price must be within a range of ₹${PRICE.MIN} and ₹${PRICE.MAX}`,
    }),

  brand: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product brand is required',
    'string.base': 'Product brand must be a string',
    'string.empty': 'Product brand cannot be empty',
    'any.invalid': 'Invalid value for brand. Expected a valid ObjectId',
  }),

  category: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product category is required',
    'string.base': 'Product category must be a string',
    'string.empty': 'Product category cannot be empty',
    'any.invalid': 'Invalid value for category. Expected a valid ObjectId',
  }),

  stock: Joi.number()
    .integer()
    .min(STOCK.MIN)
    .max(STOCK.MAX)
    .required()
    .messages({
      'any.required': 'Product stock is required',
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': `Stock must be at least ${STOCK.MIN} unit`,
      'number.max': `Stock cannot exceed ${STOCK.MAX} units`,
      'number.unsafe': `Stock must be within a range of ${STOCK.MIN} and ${STOCK.MAX} units`,
    }),
});

export const productsQuerySchema = Joi.object({
  categories: categoriesSchema,
  brands: brandsSchema,
  rating: ratingSchema,

  sort: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(PRODUCT_SORT_OPTIONS))
    .empty('')
    .default(PRODUCT_SORT_OPTIONS.RECOMMENDED)
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid value for sort. Valid options are: ${formatOptions(
        PRODUCT_SORT_OPTIONS
      )}`,
    }),

  page: pageSchema,
  limit: limitSchema,
});

export const adminProductsQuerySchema = Joi.object({
  categories: categoriesSchema,
  brands: brandsSchema,
  rating: ratingSchema,

  availability: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ACTIVE_FILTER))
    .empty('')
    .default(ACTIVE_FILTER.ALL)
    .messages({
      'string.base': 'Availability must be a string',
      'any.only': `Invalid value for availability. Valid options are: ${formatOptions(
        ACTIVE_FILTER
      )}`,
    }),

  deleted: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ACTIVE_FILTER))
    .empty('')
    .default(ACTIVE_FILTER.ALL)
    .messages({
      'string.base': 'Deleted must be a string',
      'any.only': `Invalid value for deleted. Valid options are: ${formatOptions(ACTIVE_FILTER)}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ADMIN_PRODUCT_SORT_OPTIONS))
    .empty('')
    .default(ADMIN_PRODUCT_SORT_OPTIONS.NEWLY_ADDED)
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid value for sort. Valid options are: ${formatOptions(
        ADMIN_PRODUCT_SORT_OPTIONS
      )}`,
    }),

  page: pageSchema,
  limit: limitSchema,
});

export const productIdSchema = Joi.object({
  productId: Joi.string().trim().empty(':productId').custom(validateObjectId).required().messages({
    'any.required': 'Product ID is required',
    'string.empty': 'Product ID cannot be empty',
    'any.invalid': 'Product ID is invalid. Expected a valid ObjectId',
  }),
});

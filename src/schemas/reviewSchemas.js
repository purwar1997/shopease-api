import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { formatOptions } from '../utils/helperFunctions.js';
import { removeExtraInnerSpaces } from '../utils/joiSanitizers.js';
import { validateOption, validateObjectId } from '../utils/joiValidators.js';
import { pageSchema } from './commonSchemas.js';
import { RATING } from '../constants/common.js';
import { REVIEW_SORT_OPTIONS } from '../constants/sortOptions.js';

export const reviewSchema = customJoi.object({
  rating: Joi.number()
    .integer()
    .min(RATING.MIN)
    .max(RATING.MAX)
    .unsafe()
    .required()
    .messages({
      'any.required': 'Rating is required',
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': `Rating must be at least ${RATING.MIN}`,
      'number.max': `Rating must be at most ${RATING.MAX}`,
    }),

  headline: Joi.string().trim().max(100).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Review headline is required',
    'string.base': 'Review headline must be a string',
    'string.empty': 'Review headline cannot be empty',
    'string.max': 'Review headline cannot exceed 100 characters',
  }),

  body: Joi.string().trim().max(800).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Review body is required',
    'string.base': 'Review body must be a string',
    'string.empty': 'Review body cannot be empty',
    'string.max': 'Review body cannot exceed 800 characters',
  }),
});

export const reviewsQuerySchema = Joi.object({
  sort: Joi.string()
    .trim()
    .lowercase()
    .empty('')
    .default(REVIEW_SORT_OPTIONS.TOP_REVIEWS)
    .custom(validateOption(REVIEW_SORT_OPTIONS))
    .messages({
      'string.base': 'Sort option must be a string',
      'any.invalid': `Provided an invalid sort value. Valid options are: ${formatOptions(
        REVIEW_SORT_OPTIONS
      )}`,
    }),

  page: pageSchema,
});

export const reviewIdSchema = Joi.object({
  reviewId: Joi.string().trim().empty(':reviewId').custom(validateObjectId).required().messages({
    'any.required': 'Review ID is required',
    'string.empty': 'Review ID cannot be empty',
    'any.invalid': 'Review ID is invalid. Expected a valid objectId',
  }),
});

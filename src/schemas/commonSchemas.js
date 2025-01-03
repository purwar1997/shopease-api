import Joi from 'joi';
import { PAGE, LIMIT } from '../constants/common.js';

export const pageSchema = Joi.number()
  .integer()
  .min(PAGE.MIN)
  .max(PAGE.MAX)
  .empty('')
  .default(PAGE.DEFAULT)
  .messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': `Page must be at least ${PAGE.MIN}`,
    'number.max': `Page cannot exceed ${PAGE.MAX}`,
    'number.unsafe': `Page must be within a range of ${PAGE.MIN} and ${PAGE.MAX}`,
  });

export const limitSchema = Joi.number()
  .integer()
  .min(LIMIT.MIN)
  .max(LIMIT.MAX)
  .empty('')
  .default(LIMIT.DEFAULT)
  .messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': `Limit must be at least ${LIMIT.MIN}`,
    'number.max': `Limit cannot exceed ${LIMIT.MAX}`,
    'number.unsafe': `Limit must be within a range of ${LIMIT.MIN} and ${LIMIT.MAX}`,
  });

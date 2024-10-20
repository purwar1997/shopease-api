import { DISCOUNT_TYPES } from '../constants/common.js';

export const stripEmptyKeys = obj => {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key];
    }
  }

  return obj;
};

export const stripObjectKeys =
  (...keys) =>
  (value, _helpers) => {
    for (const key of keys) {
      delete value[key];
    }

    return value;
  };

export const roundToTwoDecimalPlaces = (value, helpers) => {
  if (isNaN(value)) {
    return helpers.error('number.base');
  }

  return Math.round(value * 100) / 100;
};

export const removeExtraInnerSpaces = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base');
  }

  if (!value) {
    return helpers.error('string.empty');
  }

  return value.replace(/\s+/g, ' ');
};

export const sanitizeCommaSeparatedValues = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base');
  }

  return value.split(',').map(str => str.trim());
};

export const stripDiscountValue = (value, _helpers) => {
  const { discountType } = value;

  if (discountType === DISCOUNT_TYPES.FLAT) {
    delete value.percentageDiscount;
  } else {
    delete value.flatDiscount;
  }

  return value;
};

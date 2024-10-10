import mongoose from 'mongoose';

export const validateObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }

  return value;
};

export const validateOption = options => (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base');
  }

  if (!value) {
    return helpers.error('string.empty');
  }

  if (!Object.values(options).includes(value)) {
    return helpers.error('any.invalid');
  }

  return value;
};

export const validateCommaSeparatedValues = options => (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base');
  }

  const valuesArray = value.split(',').map(str => str.trim().toLowerCase());
  options = Object.values(options);

  for (const value of valuesArray) {
    if (!options.includes(value)) {
      return helpers.error('any.invalid');
    }
  }

  return valuesArray;
};
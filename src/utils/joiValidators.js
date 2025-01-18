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

export const validateCommaSeparatedValues = targetValue => (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base');
  }

  targetValue = Object.values(targetValue);

  const valuesArray = [
    ...new Set(
      value
        .split(',')
        .map(val => val.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];

  if (!valuesArray.every(value => targetValue.includes(value))) {
    return helpers.error('any.invalid');
  }

  return valuesArray;
};

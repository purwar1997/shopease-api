import mongoose from 'mongoose';
import pluralize from 'pluralize';
import crypto from 'crypto';
import { format } from 'date-fns';

export const sendResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const roundOneDecimal = value => {
  if (isNaN(value)) {
    return value;
  }

  return Math.round(value * 10) / 10;
};

export const roundTwoDecimals = value => {
  if (isNaN(value)) {
    return value;
  }

  return Math.round(value * 100) / 100;
};

export const lowercaseFirstLetter = str => {
  if (!str) {
    return str;
  }

  return str.at(0).toLowerCase() + str.slice(1);
};

export const capitalizeFirstLetter = str => {
  if (!str) {
    return str;
  }

  return str.at(0).toUpperCase() + str.slice(1);
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatCastError = error => {
  if (!(error instanceof mongoose.Error.CastError)) {
    return error.message;
  }

  return `Invalid value provided for ${error.path}. Expected a valid ${lowercaseFirstLetter(
    error.kind
  )} but received '${error.value}'`;
};

export const formatOptions = options => {
  const optionsList = Object.values(options);

  if (optionsList.length === 0) {
    return '';
  }

  if (optionsList.length === 1) {
    return optionsList[0];
  }

  if (optionsList.length === 2) {
    return `${optionsList[0]} and ${optionsList[1]}`;
  }

  const lastOption = optionsList.pop();
  return `${optionsList.join(', ')} and ${lastOption}`;
};

export const singularize = str => pluralize.singular(str);

export const getDateString = date => format(new Date(date), 'MMMM d, yyyy');

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  return new Date(year, month, date);
};

export const isBoolean = str => {
  str = str.trim().toLowerCase();
  return str === 'true' || str === 'false';
};

export const generateHmacSha256 = (message, secret) =>
  crypto.createHmac('sha256', secret).update(message).digest('hex');

export const deepFreeze = obj => {
  Object.freeze(obj);

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Object.isFrozen(obj[key])) {
      deepFreeze(obj[key]);
    }
  });

  return obj;
};

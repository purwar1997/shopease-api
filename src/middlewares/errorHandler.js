import mongoose from 'mongoose';
import CustomError from '../utils/customError.js';
import { formatCastError } from '../utils/helperFunctions.js';

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  err.message = err.message || 'Internal server error';
  err.code = err.code || 500;

  if (err.name === 'JSONWebTokenError') {
    const message = 'Invalid token';
    err = new CustomError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    err = new CustomError(message, 401);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(error => {
        if (error instanceof mongoose.Error.CastError) {
          return formatCastError(error);
        } else {
          return error.message;
        }
      })
      .join('. ');

    err = new CustomError(message, 400);
  }

  if (err.name === 'CastError') {
    const message = formatCastError(err);
    err = new CustomError(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate value provided for ${Object.keys(err.keyPattern)[0]}`;
    err = new CustomError(message, 400);
  }

  if (err.code < 100 || err.code > 599) {
    err.code = 500;
  }

  res.status(err.code).json({
    success: false,
    message: err.message,
  });
};

import jwt from 'jsonwebtoken';
import handleAsync from '../utils/handleAsync.js';
import config from '../config/env.config.js';
import CustomError from '../utils/customError.js';
import User from '../models/user.js';

export const isAuthenticated = handleAsync(async (req, _res, next) => {
  let token;

  if (req.cookies.token || req.headers.authorization?.startsWith('Bearer')) {
    token = req.cookies.token || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new CustomError('Access denied. Token not provided', 401);
  }

  const decodedToken = jwt.verify(token, config.auth.jwtSecretKey);

  const user = await User.findOne({ _id: decodedToken.userId, isDeleted: false });

  if (!user) {
    throw new CustomError('Access denied. User not found', 401);
  }

  req.user = user;
  next();
});

export const authorizeRole = (...allowedRoles) =>
  handleAsync((req, _res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new CustomError('You don not have necessary permissions to access this resource', 403);
    }

    next();
  });

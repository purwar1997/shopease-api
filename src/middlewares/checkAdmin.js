import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';

export const checkAdminSelfUpdate = handleAsync((req, _res, next) => {
  const loggedInUserId = req.user._id.toString();

  if (req.params.userId === loggedInUserId) {
    throw new CustomError('Admin is not allowed to update their role through this route', 403);
  }

  next();
});

export const checkAdminSelfDelete = handleAsync((req, _res, next) => {
  const loggedInUserId = req.user._id.toString();

  if (req.params.userId === loggedInUserId) {
    throw new CustomError('Admin is not allowed to delete their account through this route', 403);
  }

  next();
});

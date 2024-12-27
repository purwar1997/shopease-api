import User from '../models/user.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';
import { uploadImage, deleteImage } from '../services/cloudinaryAPIs.js';
import { userSortRules } from '../utils/sortRules.js';
import { UPLOAD_FOLDERS, PAGINATION, ROLES } from '../constants/common.js';

// Allows users to fetch their profile
export const getProfile = handleAsync(async (req, res) => {
  const { user } = req;

  sendResponse(res, 200, 'Profile fetched successfully', user);
});

// Allows users to update their profile
export const updateProfile = handleAsync(async (req, res) => {
  const updates = req.body;

  if (!updates.password) {
    delete updates.password;
  }

  const anotherUser = await User.findOne({ phone: updates.phone, _id: { $ne: req.user._id } });

  if (anotherUser) {
    throw new CustomError(
      'This phone number is being used by another user. Please provide a different phone number',
      409
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    runValidators: true,
    new: true,
  });

  sendResponse(res, 200, 'Profile updated successfully', updatedUser);
});

// Allows users to delete their account
export const deleteAccount = handleAsync(async (req, res) => {
  const userId = req.user._id;

  if (req.user.role === ROLES.ADMIN) {
    const adminCount = await User.countDocuments({
      role: ROLES.ADMIN,
      isDeleted: false,
      _id: { $ne: userId },
    });

    if (adminCount === 0) {
      throw new CustomError(
        'Currently, you are the only admin. Promote another user to the role of admin before deleting your account',
        409
      );
    }
  }

  await User.findByIdAndUpdate(
    userId,
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { runValidators: true }
  );

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Account deleted successfully');
});

// Allows users to add their profile photo
export const addProfilePhoto = handleAsync(async (req, res) => {
  const { user } = req;

  if (user.avatar?.publicId) {
    throw new CustomError('Profile photo already exists', 409);
  }

  const response = await uploadImage(UPLOAD_FOLDERS.USER_AVATARS, req.file, user._id);

  user.avatar = {
    publicId: response.public_id,
    url: response.secure_url,
  };

  const updatedUser = await user.save();

  sendResponse(res, 200, 'Profile photo added successfully', updatedUser);
});

// Allows users to update their profile photo
export const updateProfilePhoto = handleAsync(async (req, res) => {
  const { user } = req;

  if (user.avatar?.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  const response = await uploadImage(UPLOAD_FOLDERS.USER_AVATARS, req.file, user._id);

  user.avatar = {
    publicId: response.public_id,
    url: response.secure_url,
  };

  const updatedUser = await user.save();

  sendResponse(res, 200, 'Profile photo updated successfully', updatedUser);
});

// Allows users to remove their profile photo
export const removeProfilePhoto = handleAsync(async (req, res) => {
  const { user } = req;

  if (!user.avatar?.publicId) {
    throw new CustomError('Profile photo does not exist', 404);
  }

  await deleteImage(user.avatar.publicId);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $unset: { avatar: 1 } },
    { new: true }
  );

  sendResponse(res, 200, 'Profile photo removed successfully', updatedUser);
});

// Allows admins to fetch a paginated list of users
export const getUsers = handleAsync(async (req, res) => {
  const { roles, sort, page } = req.query;
  const filters = { isDeleted: false };

  if (roles.length > 0) {
    filters.role = { $in: roles };
  }

  const sortRule = sort ? userSortRules[sort] : { createdAt: -1 };
  const offset = (page - 1) * PAGINATION.USERS_PER_PAGE;
  const limit = PAGINATION.USERS_PER_PAGE;

  const users = await User.find(filters).sort(sortRule).skip(offset).limit(limit);
  const userCount = await User.countDocuments(filters);

  res.set('X-Total-Count', userCount);

  sendResponse(res, 200, 'Users fetched successfully', users);
});

// Allows admins to fetch a user by ID
export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User fetched by ID successfully', user);
});

// Allows admins to update the role of a user
export const updateUserRole = handleAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { role, roleLastUpdatedBy: req.user._id, roleUpdatedAt: new Date() },
    { runValidators: true, new: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User role updated successfully', user);
});

// Allows admins to delete a user
export const deleteUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isDeleted: true, deletedBy: req.user._id, deletedAt: new Date() },
    { runValidators: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User deleted successfully', { id: userId });
});

// Allows admins to fetch a list of other admins
export const getOtherAdmins = handleAsync(async (req, res) => {
  const otherAdmins = await User.find({
    role: ROLES.ADMIN,
    isDeleted: false,
    _id: { $ne: req.user._id },
  });

  sendResponse(res, 200, 'Admins other than current admin fetched successfully', otherAdmins);
});

// Allows admins to demote themselves to the role of a user
export const adminSelfDemote = handleAsync(async (req, res) => {
  const userId = req.user._id;

  const adminCount = await User.countDocuments({
    role: ROLES.ADMIN,
    isDeleted: false,
    _id: { $ne: userId },
  });

  if (adminCount === 0) {
    throw new CustomError(
      'Currently, you are the only admin. Promote another user to the role of admin before demoting yourself',
      409
    );
  }

  const demotedAdmin = await User.findByIdAndUpdate(
    userId,
    { role: 'user', roleLastUpdatedBy: userId, roleUpdatedAt: new Date() },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Admin demoted to the role of a user successfully', demotedAdmin);
});

// Allows admins to delete their account
export const adminSelfDelete = handleAsync(async (req, res) => {
  const userId = req.user._id;

  const adminCount = await User.countDocuments({
    role: ROLES.ADMIN,
    isDeleted: false,
    _id: { $ne: userId },
  });

  if (adminCount === 0) {
    throw new CustomError(
      'Currently, you are the only admin. Promote another user to the role of admin before deleting yourself',
      409
    );
  }

  await User.findByIdAndUpdate(
    userId,
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { runValidators: true }
  );

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Admin deleted successfully');
});

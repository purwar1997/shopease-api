import crypto from 'crypto';
import User from '../models/user.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import sendEmail from '../services/sendEmail.js';
import { setCookieOptions, clearCookieOptions } from '../utils/cookieOptions.js';
import { getPasswordResetEmail } from '../utils/emailTemplates.js';
import { sendResponse } from '../utils/helperFunctions.js';

// Allows users to create an account or restore a deleted one
export const signup = handleAsync(async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  let user = await User.findOne({ email, isDeleted: false });

  if (user) {
    throw new CustomError('User with this email already exists', 409);
  }

  user = await User.findOne({ email, isDeleted: true });

  if (user) {
    const anotherUser = await User.findOne({ phone, _id: { $ne: user._id } });

    if (anotherUser) {
      throw new CustomError(
        'This phone number is linked to another user. Please provide a different phone number',
        409
      );
    }

    const restoredUser = await User.findOneAndUpdate(
      { email },
      {
        firstname,
        lastname,
        phone,
        password,
        isDeleted: false,
        $unset: { deletedAt: 1, deletedBy: 1 },
      },
      { runValidators: true, new: true }
    );

    sendResponse(res, 200, 'Account restored successfully', restoredUser);
  }

  user = await User.findOne({ phone });

  if (user) {
    throw new CustomError(
      'This phone number is linked to another user. Please provide a different phone number',
      409
    );
  }

  const newUser = await User.create({ firstname, lastname, email, phone, password });
  newUser.password = undefined;

  sendResponse(res, 201, 'User signed up successfully', newUser);
});

// Allows users to login using their email address and password
export const login = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isDeleted: false }).select('+password');

  if (!user) {
    throw new CustomError('No user registered with this email', 400);
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    throw new CustomError('Incorrect password', 401);
  }

  const accessToken = user.generateJWTToken();

  res.cookie('token', accessToken, setCookieOptions);

  sendResponse(res, 200, 'User logged in successfully');
});

// Allows users to log out
export const logout = handleAsync(async (_req, res) => {
  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'User logged out successfully');
});

// Sends an email to the user with reset password link
export const forgotPassword = handleAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isDeleted: false });

  if (!user) {
    throw new CustomError('No user registered with this email', 400);
  }

  const resetPasswordToken = user.generateForgotPasswordToken();
  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.hostname}/reset-password/${resetPasswordToken}`;

  try {
    const options = {
      recipient: email,
      subject: 'Reset your password',
      html: getPasswordResetEmail(resetPasswordUrl),
    };

    await sendEmail(options);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    throw new CustomError('Failed to send reset password email to the user', 500);
  }

  sendResponse(res, 200, 'Password reset email sent successfully');
});

// Allows users to reset their account password
export const resetPassword = handleAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: encryptedToken,
    resetPasswordExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new CustomError('Reset password token is either invalid or expired', 400);
  }

  if (user.isDeleted) {
    throw new CustomError('Cannot reset password because account does not exist', 409);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  sendResponse(res, 200, 'Password has been reset successfully');
});
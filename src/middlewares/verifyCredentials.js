import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import {
  handleEmailVerification,
  handlePhoneVerification,
} from '../services/handleVerification.js';

export const verifyEmail = handleAsync(async (req, _res, next) => {
  const { emailToVerify, isEmailValid } = await handleEmailVerification(req.body.email);

  if (!isEmailValid) {
    throw new CustomError(
      `The email address ${emailToVerify} is not valid. Please provide a valid email address`,
      400
    );
  }

  next();
});

export const verifyPhone = handleAsync(async (req, _res, next) => {
  const { phoneToVerify, isPhoneValid } = await handlePhoneVerification(req.body.phone);

  if (!isPhoneValid) {
    throw new CustomError(
      `The phone number ${phoneToVerify} is not valid. Please provide a valid phone number`,
      400
    );
  }

  next();
});

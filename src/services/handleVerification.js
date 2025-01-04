import axios from 'axios';
import config from '../config/env.config.js';
import CustomError from '../utils/customError.js';

export const handleEmailVerification = async email => {
  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${config.verification.emailKey}&email=${email}`
    );

    const { is_valid_format, is_disposable_email, deliverability } = response.data;
    const result = { emailToVerify: email };

    if (is_valid_format.value && !is_disposable_email.value && deliverability === 'DELIVERABLE') {
      result.isEmailValid = true;
    } else {
      result.isEmailValid = false;
    }

    return result;
  } catch (error) {
    throw new CustomError('Failed to verify email address', 500);
  }
};

export const handlePhoneVerification = async phone => {
  try {
    const response = await axios.get(
      `https://phonevalidation.abstractapi.com/v1/?api_key=${config.verification.phoneKey}&phone=${phone}&country=IN`
    );

    const result = {
      phoneToVerify: phone,
      isPhoneValid: response.data.valid,
    };

    return result;
  } catch (error) {
    throw new CustomError('Failed to verify phone number', 500);
  }
};

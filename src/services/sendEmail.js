import transporter from '../config/transporter.config.js';
import config from '../config/env.config.js';
import CustomError from '../utils/customError.js';

const sendEmail = async options => {
  try {
    const info = await transporter.sendMail({
      from: config.email.senderAddress,
      to: options.recipient,
      subject: options.subject,
      html: options.html,
    });

    return info.messageId;
  } catch (error) {
    throw new CustomError('Failed to send email to the user', 500);
  }
};

export default sendEmail;

import nodemailer from 'nodemailer';
import config from './env.config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

export default transporter;

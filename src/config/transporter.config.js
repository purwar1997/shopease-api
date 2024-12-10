import nodemailer from 'nodemailer';
import config from './env.config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmail.username,
    pass: config.gmail.password,
  },
});

export default transporter;

import { v2 as cloudinary } from 'cloudinary';
import config from './env.config.js';
import { STORAGE } from '../constants/common.js';

cloudinary.config({
  cloud_name: STORAGE.CLOUD_NAME,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
  hide_sensitive: true,
});

export default cloudinary;

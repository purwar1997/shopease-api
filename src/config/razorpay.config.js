import Razorpay from 'razorpay';
import config from './env.config.js';

const instance = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export default instance;

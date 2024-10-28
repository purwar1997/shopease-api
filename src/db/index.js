import mongoose from 'mongoose';
import config from '../config/env.config.js';
import { STORAGE } from '../constants/common.js';

mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const connectToDB = async () => {
  try {
    const response = await mongoose.connect(`${config.database.url}/${STORAGE.DATABASE_NAME}`);

    console.log(`Database connection success: ${response.connection.host}`);

    mongoose.connection.on('error', error => {
      console.error('ERROR:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database connection lost');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Database successfully reconnected');
    });
  } catch (error) {
    console.log('Database connection failed');
    console.error('ERROR:', error);
    process.exit(1);
  }
};

export default connectToDB;

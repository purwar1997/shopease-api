import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/env.config.js';
import { formatOptions } from '../utils/helperFunctions.js';
import { QUANTITY, ROLES, JWT } from '../constants/common.js';
import { REGEX } from '../constants/regexPatterns.js';

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [QUANTITY.MIN, `Quantity must be at least ${QUANTITY.MIN}`],
    max: [QUANTITY.MAX, `Quantity must be at most ${QUANTITY.MAX}`],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer',
    },
  },
});

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'First name is required'],
      match: [REGEX.NAME, 'First name must contain only letters'],
      maxLength: [50, 'First name cannot exceed 50 characters'],
    },
    lastname: {
      type: String,
      match: [REGEX.NAME, 'Last name must contain only letters'],
      maxLength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      unique: true,
      immutable: true,
      required: [true, 'Email address is required'],
      match: [REGEX.EMAIL, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, 'Phone number is required'],
      match: [REGEX.PHONE, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      default: ROLES.USER,
      enum: {
        values: Object.values(ROLES),
        message: `Invalid role. Valid options are: ${formatOptions(ROLES)}`,
      },
    },
    avatar: {
      url: {
        type: String,
        match: [REGEX.IMAGE_URL, 'Invalid image URL format'],
      },
      publicId: String,
    },
    cart: [cartItemSchema],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    roleLastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: Date,
    roleUpdatedAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (!update.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname}`.trimEnd();
});

userSchema.methods = {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  },

  generateJWTToken() {
    const jwtToken = jwt.sign({ userId: this._id }, config.auth.jwtSecretKey, {
      expiresIn: JWT.EXPIRY,
    });

    return jwtToken;
  },

  generateForgotPasswordToken() {
    const token = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000);

    return token;
  },
};

export default mongoose.model('User', userSchema);

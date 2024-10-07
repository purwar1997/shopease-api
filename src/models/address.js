import mongoose from 'mongoose';
import { REGEX } from '../constants/regexPatterns.js';

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      match: [REGEX.FULL_NAME, 'Full name must contain only letters'],
      maxLength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [REGEX.PHONE, 'Please enter a valid phone number for delivery issues'],
    },
    line1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      maxLength: [200, 'Address line 1 cannot exceed 200 characters'],
    },
    line2: {
      type: String,
      maxLength: [200, 'Address line 2 cannot exceed 200 characters'],
    },
    landmark: {
      type: String,
      maxLength: [200, 'Landmark cannot exceed 200 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      match: [REGEX.POSTAL_CODE, 'Please enter a valid postal code'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who added this address is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: function (_doc, res) {
        res.id = res._id;
        delete res._id;
        return res;
      },
    },
  }
);

export default mongoose.model('Address', addressSchema);

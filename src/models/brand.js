import mongoose from 'mongoose';
import { REGEX } from '../constants/regexPatterns.js';

const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Brand name is required'],
      maxLength: [50, 'Brand name cannot exceed 50 characters'],
    },
    logo: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
        match: [REGEX.IMAGE_URL, 'Invalid image URL format'],
      },
      publicId: {
        type: String,
        required: [true, 'Image public ID is required'],
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who added this brand is required'],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Brand', brandSchema);

import mongoose from 'mongoose';
import { REGEX } from '../constants/regexPatterns.js';

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Category title is required'],
      maxLength: [50, 'Category title cannot exceed 50 characters'],
    },
    image: {
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
      required: [true, 'The ID of the user who added this category is required'],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
      transform: function (_doc, res) {
        res.id = res._id;
        delete res._id;
        return res;
      },
    },
  }
);

export default mongoose.model('Category', categorySchema);

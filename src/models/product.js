import mongoose from 'mongoose';
import { roundOneDecimal, roundTwoDecimals } from '../utils/helperFunctions.js';
import { PRICE, STOCK } from '../constants/common.js';
import { REGEX } from '../constants/regexPatterns.js';

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      maxLength: [100, 'Product title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxLength: [500, 'Product description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [PRICE.MIN, `Products priced below ₹${PRICE.MIN} cannot be listed`],
      max: [PRICE.MAX, `Products priced above ₹${PRICE.MAX} cannot be listed`],
      set: roundTwoDecimals,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Product brand is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      max: [STOCK.MAX, `Stock cannot exceed ${STOCK.MAX} units`],
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be an integer',
      },
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
    soldUnits: {
      type: Number,
      default: 0,
      min: [0, 'Sold units cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Sold units must be an integer',
      },
    },
    avgRating: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be negative'],
      max: [5, 'Average rating cannot exceed 5'],
      set: roundOneDecimal,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Review count must be an integer',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who added this product is required'],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: Date,
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

productSchema.index({ title: 1, brand: 1, category: 1 }, { unique: true });

export default mongoose.model('Product', productSchema);

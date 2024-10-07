import mongoose from 'mongoose';
import { RATING } from '../constants/common.js';

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [RATING.MIN, `Rating must be at least ${RATING.MIN}`],
      max: [RATING.MAX, `Rating must be at most ${RATING.MAX}`],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    headline: {
      type: String,
      required: [true, 'Review headline is required'],
      maxLength: [100, 'Review headline cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
      maxLength: [800, 'Review body cannot exceed 800 characters'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'The ID of the product being reviewed is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who added this review is required'],
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

export default mongoose.model('Review', reviewSchema);

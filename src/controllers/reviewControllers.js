import Review from '../models/review.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { reviewSortRules } from '../utils/sortRules.js';
import { ORDER_STATUS } from '../constants/common.js';

// Retrieves a paginated list of reviews for a product
export const getProductReviews = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const { sort, page, limit } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const sortRule = reviewSortRules[sort];

  const reviews = await Review.find({ product: productId })
    .sort(sortRule)
    .skip((page - 1) * limit)
    .limit(limit);

  const reviewCount = await Review.countDocuments({ product: productId });

  res.set('X-Total-Count', reviewCount);

  sendResponse(res, 200, 'Reviews retrieved successfully', reviews);
});

// Allows users to add a review for a purchased product
export const addProductReview = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const existingReview = await Review.findOne({ product: productId, user: userId });

  if (existingReview) {
    throw new CustomError('You have already reviewed this product', 409);
  }

  const order = await Order.findOne({
    user: userId,
    items: {
      $elemMatch: { product: productId },
    },
    isPaid: true,
  });

  if (!order) {
    throw new CustomError('Only the user who has bought this product can add a review', 403);
  }

  if (order.status !== ORDER_STATUS.DELIVERED) {
    throw new CustomError(
      'Reviews for products can only be submitted after the order has been delivered',
      403
    );
  }

  const addedReview = await Review.create({ ...req.body, product: productId, user: userId });

  product.avgRating =
    (product.avgRating * product.reviewCount + req.body.rating) / (product.reviewCount + 1);

  product.reviewCount = product.reviewCount + 1;

  await product.save();

  sendResponse(res, 201, 'Review added successfully', addedReview);
});

// Allows users to retrieve their review for a product by ID
export const getProductReviewById = handleAsync(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError('Review not found', 404);
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who has added this review can view it', 403);
  }

  sendResponse(res, 200, 'Review retrieved by ID successfully', review);
});

// Allows users to update their review of a product
export const updateProductReview = handleAsync(async (req, res) => {
  const { reviewId } = req.params;
  const updates = req.body;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError('Review not found', 404);
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who has added this review can update it', 403);
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, {
    runValidators: true,
    new: true,
  });

  const product = await Product.findById(updatedReview.product);

  product.avgRating =
    (product.avgRating * product.reviewCount - review.rating + updates.rating) /
    product.reviewCount;

  await product.save();

  sendResponse(res, 200, 'Review updated successfully', updatedReview);
});

import express from 'express';
import {
  getProductReviews,
  addProductReview,
  getProductReviewById,
  updateProductReview,
} from '../controllers/reviewControllers.js';
import { reviewSchema, reviewIdSchema, reviewsQuerySchema } from '../schemas/reviewSchemas.js';
import { productIdSchema } from '../schemas/productSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import {
  validatePayload,
  validatePathParams,
  validateQueryParams,
} from '../middlewares/requestValidators.js';

const router = express.Router();

router
  .route('/products/:productId/reviews')
  .get(
    validatePathParams(productIdSchema),
    validateQueryParams(reviewsQuerySchema),
    getProductReviews
  )
  .post(
    isAuthenticated,
    validatePathParams(productIdSchema),
    validatePayload(reviewSchema),
    addProductReview
  );

router
  .route('/reviews/:reviewId')
  .all( isAuthenticated, validatePathParams(reviewIdSchema))
  .get(getProductReviewById)
  .put(validatePayload(reviewSchema), updateProductReview);

export default router;

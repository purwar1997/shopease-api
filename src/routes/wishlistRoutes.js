import express from 'express';
import {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  moveItemToCart,
  clearWishlist,
} from '../controllers/wishlistControllers.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { productIdSchema } from '../schemas/wishlistSchemas.js';

const router = express.Router();

router.route('/wishlist').get(isAuthenticated, getWishlist);

router
  .route('/wishlist/add')
  .put(isAuthenticated, validatePayload(productIdSchema), addItemToWishlist);

router
  .route('/wishlist/remove')
  .put(isAuthenticated, validatePayload(productIdSchema), removeItemFromWishlist);

router
  .route('/wishlist/move')
  .put(isAuthenticated, validatePayload(productIdSchema), moveItemToCart);

router.route('/wishlist/clear').put(isAuthenticated, clearWishlist);

export default router;

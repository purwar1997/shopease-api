import express from 'express';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  moveItemToWishlist,
  clearCart,
} from '../controllers/cartControllers.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { productIdSchema, updateQuantitySchema } from '../schemas/cartSchemas.js';

const router = express.Router();

router.route('/cart').get(isAuthenticated, getCart);
router.route('/cart/add').post(isAuthenticated, validatePayload(productIdSchema), addItemToCart);

router
  .route('/cart/remove')
  .put(isAuthenticated, validatePayload(productIdSchema), removeItemFromCart);

router
  .route('/cart/update')
  .put(isAuthenticated, validatePayload(updateQuantitySchema), updateItemQuantity);

router
  .route('/cart/move')
  .put(isAuthenticated, validatePayload(productIdSchema), moveItemToWishlist);

router.route('/cart/clear').put(isAuthenticated, clearCart);

export default router;

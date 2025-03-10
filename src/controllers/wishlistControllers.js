import User from '../models/user.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helperFunctions.js';

// Allows users to retrieve their wishlist
export const getWishlist = handleAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: {
      isDeleted: false,
    },
  });

  sendResponse(res, 200, 'Wishlist retrieved successfully', user.wishlist);
});

// Allows users to add an item to their wishlist
export const addItemToWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const wishlistItem = user.wishlist.find(item => item.toString() === productId);

  if (wishlistItem) {
    throw new CustomError('Item already present in wishlist', 409);
  }

  user.wishlist.push(productId);
  await user.save();

  sendResponse(res, 200, 'Item added to wishlist successfully', product);
});

// Allows users to remove an item from their wishlist
export const removeItemFromWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const wishlistItem = user.wishlist.find(item => item.toString() === productId);

  if (!wishlistItem) {
    throw new CustomError('Item not found in wishlist', 404);
  }

  user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
  await user.save();

  sendResponse(res, 200, 'Item removed from wishlist successfully', productId);
});

// Allows users to move an item from their wishlist to cart
export const moveItemToCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const wishlistItem = user.wishlist.find(item => item.toString() === productId);

  if (!wishlistItem) {
    throw new CustomError('Item not found in wishlist', 404);
  }

  if (product.stock === 0) {
    throw new CustomError('Item is out of stock and cannot be moved to the cart', 409);
  }

  user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
  const cartItem = user.cart.find(item => item.product.toString() === productId);

  if (!cartItem) {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();

  sendResponse(res, 200, 'Item moved from wishlist to cart successfully', product);
});

// Allows users to clear their wishlist
export const clearWishlist = handleAsync(async (req, res) => {
  const { user } = req;

  user.wishlist = [];
  await user.save();

  sendResponse(res, 200, 'Wishlist cleared successfully');
});

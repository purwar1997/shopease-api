import User from '../models/user.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { QUANTITY } from '../constants/common.js';

// Allows users to fetch their cart
export const getCart = handleAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    match: {
      isDeleted: false,
      stock: { $gt: 0 },
    },
  });

  sendResponse(res, 200, 'Cart fetched successfully', user.cart);
});

// Allows users to add an item to their cart
export const addItemToCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  if (product.stock === 0) {
    throw new CustomError('Item is out of stock and cannot be added to the cart', 409);
  }

  const cartItem = user.cart.find(item => item.product.toString() === productId);

  if (cartItem) {
    if (cartItem.quantity >= QUANTITY.MAX) {
      throw new CustomError(
        `You cannot purchase more than ${QUANTITY.MAX} units of a specific item`,
        403
      );
    }

    if (cartItem.quantity >= product.stock) {
      throw new CustomError(
        `You cannot add more items than available stock (${product.stock} units)`,
        403
      );
    }

    cartItem.quantity = cartItem.quantity + 1;
    const index = user.cart.findIndex(item => item.product.toString() === productId);
    user.cart.splice(index, 1, cartItem);
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();

  const result = {
    product,
    quantity: cartItem ? cartItem.quantity : 1,
  };

  sendResponse(res, 200, 'Item added to cart successfully', result);
});

// Allows users to remove an item from their cart
export const removeItemFromCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const cartItem = user.cart.find(item => item.product.toString() === productId);

  if (!cartItem) {
    throw new CustomError('Item not found in cart', 404);
  }

  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();

  sendResponse(res, 200, 'Item removed from cart successfully', { id: productId });
});

// Allows users to update quantity of a cart item
export const updateItemQuantity = handleAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const cartItem = user.cart.find(item => item.product.toString() === productId);

  if (!cartItem) {
    throw new CustomError('Item not found in cart', 404);
  }

  if (quantity > QUANTITY.MAX) {
    throw new CustomError(
      `You cannot purchase more than ${QUANTITY.MAX} units of a specific item`,
      403
    );
  }

  if (quantity > product.stock) {
    throw new CustomError(
      `Requested quantity exceeds available stock (${product.stock} units)`,
      409
    );
  }

  cartItem.quantity = quantity;
  const index = user.cart.findIndex(item => item.product.toString() === productId);
  user.cart.splice(index, 1, cartItem);
  await user.save();

  const result = { product, quantity };

  sendResponse(res, 200, 'Item quantity updated successfully', result);
});

// Allows users to move an item from their cart to wishlist
export const moveItemToWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const cartItem = user.cart.find(item => item.product.toString() === productId);

  if (!cartItem) {
    throw new CustomError('Item not found in cart', 404);
  }

  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  const wishlistItem = user.wishlist.find(item => item.toString() === productId);

  if (!wishlistItem) {
    user.wishlist.push(productId);
  }

  await user.save();

  sendResponse(res, 200, 'Item moved from cart to wishlist successfully', product);
});

// Allows users to clear their cart
export const clearCart = handleAsync(async (req, res) => {
  const { user } = req;

  user.cart = [];
  await user.save();

  sendResponse(res, 200, 'Cart cleared successfully');
});

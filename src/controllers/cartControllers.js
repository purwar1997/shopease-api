import User from '../models/user.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { QUANTITY } from '../constants/common.js';

// Fetches cart of a logged-in user
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

// Allows a logged-in user to add an item to their cart
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

  const cartItem = user.cart.find(cartItem => cartItem.product.toString() === productId);

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
    const index = user.cart.findIndex(cartItem => cartItem.product.toString() === productId);
    user.cart.splice(index, 1, cartItem);
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();

  const data = {
    product,
    quantity: cartItem ? cartItem.quantity : 1,
  };

  sendResponse(res, 200, 'Item added to cart successfully', data);
});

// Allows a logged-in user to remove an item from their cart
export const removeItemFromCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const cartItem = user.cart.find(cartItem => cartItem.product.toString() === productId);

  if (!cartItem) {
    throw new CustomError('Item not found in cart', 404);
  }

  user.cart = user.cart.filter(cartItem => cartItem.product.toString() !== productId);
  await user.save();

  sendResponse(res, 200, 'Item removed from cart successfully', productId);
});

// Allows a logged-in user to update quantity of a cart item
export const updateItemQuantity = handleAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const cartItem = user.cart.find(cartItem => cartItem.product.toString() === productId);

  if (!cartItem) {
    throw new CustomError('Item not found in cart', 404);
  }

  if (quantity > product.stock) {
    throw new CustomError(
      `Requested quantity exceeds available stock (${product.stock} units)`,
      409
    );
  }

  cartItem.quantity = quantity;
  const index = user.cart.findIndex(cartItem => cartItem.product.toString() === productId);
  user.cart.splice(index, 1, cartItem);
  await user.save();

  const data = { product, quantity };

  sendResponse(res, 200, 'Item quantity updated successfully', data);
});

// Allows a logged-in user to move an item from their cart to wishlist
export const moveItemToWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const cartItem = user.cart.find(cartItem => cartItem.product.toString() === productId);

  if (!cartItem) {
    throw new CustomError('Item not found in cart', 404);
  }

  user.cart = user.cart.filter(cartItem => cartItem.product.toString() !== productId);
  const wishlistItem = user.wishlist.find(wishlistItem.toString() === productId);

  if (!wishlistItem) {
    user.wishlist.push(productId);
  }

  await user.save();

  sendResponse(res, 200, 'Item moved from cart to wishlist successfully', product);
});

// Allows a logged-in user to remove all items from their cart
export const clearCart = handleAsync(async (req, res) => {
  const { user } = req;

  user.cart = [];
  await user.save();

  sendResponse(res, 200, 'Cart cleared successfully');
});
export const expectedHttpActions = {
  // Authentication routes
  '/signup': ['POST'],
  '/login': ['POST'],
  '/logout': ['POST'],
  '/password/forgot': ['POST'],
  '/password/reset/:token': ['PUT'],

  // User routes
  '/users/self': ['GET', 'PUT', 'DELETE'],
  '/users/self/avatar': ['POST', 'PUT'],
  '/users/self/avatar/update': ['POST'],
  '/admin/users': ['GET'],
  '/admin/users/:userId': ['GET', 'PUT', 'DELETE'],
  '/admin/admins': ['GET'],
  '/admin/self': ['PUT', 'DELETE'],

  // Address routes
  '/addresses': ['GET', 'POST'],
  '/addresses/:addressId': ['GET', 'PUT', 'DELETE'],
  '/addresses/:addressId/default': ['PUT'],

  // Cart routes
  '/cart': ['GET'],
  '/cart/add': ['POST'],
  '/cart/remove': ['PUT'],
  '/cart/update': ['PUT'],
  '/cart/move': ['PUT'],
  '/cart/clear': ['PUT'],

  // Wishlist routes
  '/wishlist': ['GET'],
  '/wishlist/add': ['PUT'],
  '/wishlist/remove': ['PUT'],
  '/wishlist/move': ['PUT'],
  '/wishlist/clear': ['PUT'],

  // Product routes
  '/products': ['GET'],
  '/products/:productId': ['GET'],
  '/admin/products': ['GET', 'POST'],
  '/admin/products/:productId': ['GET', 'POST', 'DELETE'],
  '/admin/products/:productId/restore': ['PUT'],

  // Category routes
  '/categories': ['GET'],
  '/categories/:categoryId': ['GET'],
  '/admin/categories': ['GET', 'POST'],
  '/admin/categories/:categoryId': ['POST'],

  // Brand routes
  '/brands': ['GET'],
  '/brands/:brandId': ['GET'],
  '/admin/brands': ['GET', 'POST'],
  '/admin/brands/:brandId': ['POST'],

  // Coupon routes
  '/coupons': ['GET'],
  '/coupons/validity': ['GET'],
  '/admin/coupons': ['GET', 'POST'],
  '/admin/coupons/:couponId': ['GET', 'PUT', 'DELETE'],
  '/admin/coupons/:couponId/activate': ['PUT'],
  '/admin/coupons/:couponId/deactivate': ['PUT'],

  // Order routes
  '/orders': ['GET', 'POST'],
  '/orders/:orderId': ['GET'],
  '/orders/:orderId/confirm': ['PUT'],
  '/orders/:orderId/cancel': ['PUT'],
  '/admin/orders': ['GET'],
  '/admin/orders/:orderId': ['GET', 'PUT', 'DELETE'],

  // Review routes
  '/products/:productId/reviews': ['GET', 'POST'],
  '/reviews/:reviewId': ['GET', 'PUT'],
};

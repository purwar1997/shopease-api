export const PRODUCT_SORT_OPTIONS = Object.freeze({
  RECOMMENDED: 'recommended',
  NEWLY_ADDED: 'new',
  CUSTOMER_RATING: 'rating',
  PRICE_LOW_TO_HIGH: 'price_asc',
  PRICE_HIGH_TO_LOW: 'price_desc',
});

export const ADMIN_PRODUCT_SORT_OPTIONS = Object.freeze({
  NEWLY_ADDED: 'new',
  CUSTOMER_RATING: 'rating',
  PRICE_LOW_TO_HIGH: 'price_asc',
  PRICE_HIGH_TO_LOW: 'price_desc',
  STOCK_LOW_TO_HIGH: 'stock_asc',
  STOCK_HIGH_TO_LOW: 'stock_desc',
});

export const COUPON_SORT_OPTIONS = Object.freeze({
  EXPIRY_ASC: 'expiry_asc',
  EXPIRY_DESC: 'expiry_desc',
});

export const REVIEW_SORT_OPTIONS = Object.freeze({
  TOP_REVIEWS: 'top',
  MOST_RECENT: 'recent',
});

export const USER_SORT_OPTIONS = Object.freeze({
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
});

export const ORDER_SORT_OPTIONS = Object.freeze({
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  AMOUNT_LOW_TO_HIGH: 'amount_asc',
  AMOUNT_HIGH_TO_LOW: 'amount_desc',
});

import { deepFreeze } from '../utils/helperFunctions.js';

export const STORAGE = Object.freeze({
  DATABASE_NAME: 'shopease_db',
  CLOUD_NAME: 'dlqnx5pot',
});

export const JWT = Object.freeze({
  EXPIRY: '24h',
});

export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

export const ORDER_STATUS = Object.freeze({
  CREATED: 'created',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

export const DELIVERY_MODES = Object.freeze({
  STANDARD: 'standard',
  EXPRESS: 'express',
});

export const DISCOUNT_TYPES = Object.freeze({
  PERCENTAGE: 'percentage',
  FLAT: 'flat',
});

export const COUPON_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
});

export const UPLOAD_FOLDERS = Object.freeze({
  USER_AVATARS: 'user-avatars',
  CATEGORY_IMAGES: 'category-images',
  BRAND_LOGOS: 'brand-logos',
  PRODUCT_IMAGES: 'product-images',
});

export const UPLOAD_FILES = Object.freeze({
  USER_AVATAR: 'avatar',
  CATEGORY_IMAGE: 'image',
  BRAND_LOGO: 'logo',
  PRODUCT_IMAGE: 'image',
});

export const PAGINATION = Object.freeze({
  PRODUCTS_PER_PAGE: 15,
  ORDERS_PER_PAGE: 10,
  USERS_PER_PAGE: 10,
  COUPONS_PER_PAGE: 10,
  REVIEWS_PER_PAGE: 5,
});

export const PRICE = Object.freeze({
  MIN: 10,
  MAX: 100000,
});

export const STOCK = Object.freeze({
  MIN: 1,
  MAX: 10000,
});

export const QUANTITY = Object.freeze({
  MIN: 1,
  MAX: 10,
});

export const RATING = Object.freeze({
  MIN: 1,
  MAX: 5,
});

export const SHIPPING_CHARGES = Object.freeze({
  MIN: 30,
});

export const GST = Object.freeze({
  RATE: 0.18,
});

export const DISCOUNT = Object.freeze({
  MIN_FLAT: 10,
  MAX_FLAT: 1000,
  FLAT_MULTIPLE: 10,
  MIN_PERCENTAGE: 1,
  MAX_PERCENTAGE: 100,
});

export const FILE_UPLOAD = Object.freeze({
  MAX_FILES: 1,
  MAX_FILE_SIZE: 20 * 1024 * 1024,
});

export const SAFE_INTEGER = Object.freeze({
  MIN: Number.MIN_SAFE_INTEGER,
  MAX: Number.MAX_SAFE_INTEGER,
});

export const DELIVERY_OPTIONS = deepFreeze([
  {
    TYPE: DELIVERY_MODES.STANDARD,
    SHIPPING_CHARGES: 30,
    SHIPPING_TIME: {
      MIN: 4,
      MAX: 10,
    },
  },
  {
    TYPE: DELIVERY_MODES.EXPRESS,
    SHIPPING_CHARGES: 100,
    SHIPPING_TIME: {
      MIN: 2,
      MAX: 5,
    },
  },
]);

export const CRON_OPTIONS = Object.freeze({
  TIMEZONE: 'Asia/Kolkata',
});

export const BUSINESS_INFO = Object.freeze({
  NAME: 'Shopease',
  WEBSITE_LOGO:
    'https://res.cloudinary.com/dlqnx5pot/image/upload/v1724768966/shopease-logo_a9ayl7.svg',
  WEBSITE_URL: 'http://shopease.shubhampurwar.in',
  CONTACT_EMAIL: 'shubhampurwar35@gmail.com',
  CONTACT_PHONE: '9897887871',
});
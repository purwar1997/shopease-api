export const REGEX = Object.freeze({
  NAME: /^[a-zA-Z]+$/,
  FULL_NAME: /^[A-Za-z\s]*$/,
  EMAIL: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /(0|91)?[6-9][0-9]{9}/,
  PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{6,20}$/,
  POSTAL_CODE: /^[0-9A-Z]{2,4}[ -]?[0-9A-Z]{3,4}$/,
  IMAGE_URL: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
  COUPON_CODE: /^[A-Z][A-Z0-9]{4,14}$/,
});

import express from 'express';
import {
  getAddresses,
  addNewAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressControllers.js';
import { addressSchema, addressIdSchema } from '../schemas/addressSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';
import { verifyPhone } from '../middlewares/verifyCredentials.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';

const router = express.Router();

router
  .route('/addresses')
  .all(isHttpMethodAllowed, isAuthenticated)
  .get(getAddresses)
  .post(validatePayload(addressSchema), verifyPhone, addNewAddress);

router
  .route('/addresses/:addressId')
  .all(isHttpMethodAllowed, isAuthenticated, validatePathParams(addressIdSchema))
  .get(getAddressById)
  .put(validatePayload(addressSchema), verifyPhone, updateAddress)
  .delete(deleteAddress);

router
  .route('/addresses/:addressId/default')
  .put(isAuthenticated, validatePathParams(addressIdSchema), setDefaultAddress);

export default router;

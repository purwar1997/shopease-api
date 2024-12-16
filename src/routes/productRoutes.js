import express from 'express';
import {
  getProducts,
  getProductById,
  adminGetProducts,
  addNewProduct,
  adminGetProductById,
  updateProduct,
  deleteProduct,
  restoreDeletedProduct,
} from '../controllers/productControllers.js';
import {
  productSchema,
  productIdSchema,
  productsQuerySchema,
  adminProductsQuerySchema,
} from '../schemas/productSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import {
  validatePayload,
  validatePathParams,
  validateQueryParams,
} from '../middlewares/requestValidators.js';
import { ROLES, UPLOAD_FOLDERS, UPLOAD_FILES } from '../constants/common.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';

const router = express.Router();

router.route('/products').get(validateQueryParams(productsQuerySchema), getProducts);
router.route('/products/:productId').get(validatePathParams(productIdSchema), getProductById);

router
  .route('/admin/products')
  .all(isHttpMethodAllowed, isAuthenticated, authorizeRole(ROLES.ADMIN))
  .get(validateQueryParams(adminProductsQuerySchema), adminGetProducts)
  .post(
    parseFormData(UPLOAD_FOLDERS.PRODUCT_IMAGES, UPLOAD_FILES.PRODUCT_IMAGE),
    validatePayload(productSchema),
    addNewProduct
  );

router
  .route('/admin/products/:productId')
  .all(
    isHttpMethodAllowed,
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(productIdSchema)
  )
  .get(adminGetProductById)
  .post(
    parseFormData(UPLOAD_FOLDERS.PRODUCT_IMAGES, UPLOAD_FILES.PRODUCT_IMAGE),
    validatePayload(productSchema),
    updateProduct
  )
  .delete(deleteProduct);

router
  .route('/admin/products/:productId/restore')
  .put(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(productIdSchema),
    restoreDeletedProduct
  );

export default router;

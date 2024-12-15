import express from 'express';
import {
  getBrands,
  getBrandById,
  getAllBrands,
  addNewBrand,
  updateBrand,
} from '../controllers/brandControllers.js';
import { brandSchema, brandIdSchema } from '../schemas/brandSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';
import { ROLES, UPLOAD_FOLDERS, UPLOAD_FILES } from '../constants/common.js';

const router = express.Router();

router.route('/brands').get(getBrands);
router.route('/brands/:brandId').get(validatePathParams(brandIdSchema), getBrandById);

router
  .route('/admin/brands')
  .all(isAuthenticated, authorizeRole(ROLES.ADMIN))
  .get(getAllBrands)
  .post(
    parseFormData(UPLOAD_FOLDERS.BRAND_LOGOS, UPLOAD_FILES.BRAND_LOGO),
    validatePayload(brandSchema),
    addNewBrand
  );

router
  .route('/admin/brands/:brandId')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(brandIdSchema),
    parseFormData(UPLOAD_FOLDERS.BRAND_LOGOS, UPLOAD_FILES.BRAND_LOGO),
    validatePayload(brandSchema),
    updateBrand
  );

export default router;

import express from 'express';
import {
  getCategories,
  getCategoryById,
  getAllCategories,
  addNewCategory,
  updateCategory,
} from '../controllers/categoryControllers.js';
import { categorySchema, categoryIdSchema } from '../schemas/categorySchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { ROLES, UPLOAD_FOLDERS, UPLOAD_FILES } from '../constants/common.js';

const router = express.Router();

router.route('/categories').get(getCategories);
router.route('/categories/:categoryId').get(validatePathParams(categoryIdSchema), getCategoryById);

router
  .route('/admin/categories')
  .all(isHttpMethodAllowed, isAuthenticated, authorizeRole(ROLES.ADMIN))
  .get(getAllCategories)
  .post(
    parseFormData(UPLOAD_FOLDERS.CATEGORY_IMAGES, UPLOAD_FILES.CATEGORY_IMAGE),
    validatePayload(categorySchema),
    addNewCategory
  );

router
  .route('/admin/categories/:categoryId')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(categoryIdSchema),
    parseFormData(UPLOAD_FOLDERS.CATEGORY_IMAGES, UPLOAD_FILES.CATEGORY_IMAGE),
    validatePayload(categorySchema),
    updateCategory
  );

export default router;

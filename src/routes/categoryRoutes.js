import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  updateCategory,
  getListedCategories,
} from '../controllers/categoryControllers.js';
import { categorySchema, categoryIdSchema } from '../schemas/categorySchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';
import { ROLES, UPLOAD_FOLDERS, UPLOAD_FILES } from '../constants/common.js';

const router = express.Router();

router.route('/categories').get(getAllCategories);
router.route('/categories/:categoryId').get(validatePathParams(categoryIdSchema), getCategoryById);

router
  .route('/admin/categories')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
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

router.route('/categories/listed').get(getListedCategories);
  
export default router;

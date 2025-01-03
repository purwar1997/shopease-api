import mongoose from 'mongoose';
import Product from '../models/product.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse, isBoolean } from '../utils/helperFunctions.js';
import { productSortRules, adminProductSortRules } from '../utils/sortRules.js';
import { deleteImage, uploadImage } from '../services/cloudinaryAPIs.js';
import { UPLOAD_FOLDERS } from '../constants/common.js';
import { ACTIVE_FILTER } from '../constants/filterOptions.js';

// Fetches a paginated list of products
export const getProducts = handleAsync(async (req, res) => {
  const { categories, brands, rating, sort, page, limit } = req.query;
  const filters = { isDeleted: false };

  if (categories.length) {
    const categoryList = await Category.find({ title: { $in: categories } });
    const categoryIDs = categoryList.map(category => category._id);
    filters.category = { $in: categoryIDs };
  }

  if (brands.length) {
    const brandList = await Brand.find({ name: { $in: brands } });
    const brandIDs = brandList.map(brand => brand._id);
    filters.brand = { $in: brandIDs };
  }

  if (rating) {
    filters.avgRating = { $gte: rating };
  }

  const sortRule = productSortRules[sort];

  const products = await Product.find(filters)
    .sort(sortRule)
    .skip((page - 1) * limit)
    .limit(limit);

  const productCount = await Product.countDocuments(filters);

  res.set('X-Total-Count', productCount);

  sendResponse(res, 200, 'Products fetched successfully', products);
});

// Fetches a product by ID
export const getProductById = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product fetched by ID successfully', product);
});

// Allows admins to fetch a paginated list of products
export const adminGetProducts = handleAsync(async (req, res) => {
  const { categories, brands, rating, availability, deleted, sort, page, limit } = req.query;
  const filters = {};

  if (categories.length) {
    const categoryList = await Category.find({ title: { $in: categories } });
    const categoryIDs = categoryList.map(category => category._id);
    filters.category = { $in: categoryIDs };
  }

  if (brands.length) {
    const brandList = await Brand.find({ name: { $in: brands } });
    const brandIDs = brandList.map(brand => brand._id);
    filters.brand = { $in: brandIDs };
  }

  if (rating) {
    filters.avgRating = { $gte: rating };
  }

  if (availability && isBoolean(availability)) {
    filters.stock = availability === ACTIVE_FILTER.TRUE ? { $gt: 0 } : 0;
  }

  if (deleted && isBoolean(deleted)) {
    filters.isDeleted = deleted;
  }

  const sortRule = adminProductSortRules[sort];

  const products = await Product.find(filters)
    .sort(sortRule)
    .skip((page - 1) * limit)
    .limit(limit);

  const productCount = await Product.countDocuments(filters);

  res.set('X-Total-Count', productCount);

  sendResponse(res, 200, 'Products fetched successfully', products);
});

// Allows admins to fetch a product by ID
export const adminGetProductById = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product fetched by ID successfully', product);
});

// Allows admins to add a new product
export const addNewProduct = handleAsync(async (req, res) => {
  const { title, brand, category } = req.body;

  const existingBrand = await Brand.findById(brand);

  if (!existingBrand) {
    throw new CustomError('Provided brand does not exist', 404);
  }

  const existingCategory = await Category.findById(category);

  if (!existingCategory) {
    throw new CustomError('Provided category does not exist', 404);
  }

  const existingProduct = await Product.findOne({ title, brand, category });

  if (existingProduct) {
    throw new CustomError(
      'Product title must be unique within the same brand and category. To proceed, please change either the product title, category or brand',
      409
    );
  }

  const productId = new mongoose.Types.ObjectId();

  const response = await uploadImage(UPLOAD_FOLDERS.PRODUCT_IMAGES, req.file, productId);

  const newProduct = await Product.create({
    _id: productId,
    ...req.body,
    image: {
      url: response.secure_url,
      publicId: response.public_id,
    },
    createdBy: req.user._id,
  });

  sendResponse(res, 201, 'Product added successfully', newProduct);
});

// Allows admins to update a product
export const updateProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const { title, brand, category } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const existingBrand = await Brand.findById(brand);

  if (!existingBrand) {
    throw new CustomError('Provided brand does not exist', 404);
  }

  const existingCategory = await Category.findById(category);

  if (!existingCategory) {
    throw new CustomError('Provided category does not exist', 404);
  }

  const existingProduct = await Product.findOne({
    title,
    brand,
    category,
    _id: { $ne: productId },
  });

  if (existingProduct) {
    throw new CustomError(
      'Product title must be unique within the same brand and category. To proceed, please change either the product title, category or brand',
      409
    );
  }

  await deleteImage(product.image.publicId);

  const response = await uploadImage(UPLOAD_FOLDERS.PRODUCT_IMAGES, req.file, productId);

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      ...req.body,
      image: {
        url: response.secure_url,
        publicId: response.public_id,
      },
      lastUpdatedBy: req.user._id,
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Product updated successfully', updatedProduct);
});

// Allows admins to delete a product
export const deleteProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const deletedProduct = await Product.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    {
      isDeleted: true,
      deletedBy: req.user._id,
      deletedAt: new Date(),
    },
    { runValidators: true }
  );

  if (!deletedProduct) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product deleted successfully', { id: productId });
});

// Allows admins to restore a deleted product
export const restoreDeletedProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const restoredProduct = await Product.findByIdAndUpdate(
    productId,
    {
      isDeleted: false,
      $unset: { deletedBy: 1, deletedAt: 1 },
    },
    { runValidators: true, new: true }
  );

  if (!restoredProduct) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product restored successfully', restoredProduct);
});

import mongoose from 'mongoose';
import Brand from '../models/brand.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { uploadImage, deleteImage } from '../services/cloudinaryAPIs.js';
import { UPLOAD_FOLDERS } from '../constants/common.js';

// Fetches a list of brands under which products have been listed
export const getBrands = handleAsync(async (_req, res) => {
  const brands = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'brandDetails',
      },
    },
    { $unwind: { path: '$brandDetails' } },
    { $replaceRoot: { newRoot: '$brandDetails' } },
    {
      $group: {
        _id: '$_id',
        document: { $first: '$$ROOT' },
      },
    },
    { $replaceRoot: { newRoot: '$document' } },
    {
      $set: {
        id: '$_id',
        _id: '$$REMOVE',
        __v: '$$REMOVE',
      },
    },
  ]);

  sendResponse(res, 200, 'Brands fetched succesfully', brands);
});

// Fetches a brand by ID
export const getBrandById = handleAsync(async (req, res) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw new CustomError('Brand not found', 404);
  }

  sendResponse(res, 200, 'Brand fetched by ID successfully', brand);
});

// Fetches a list of all brands
export const getAllBrands = handleAsync(async (_req, res) => {
  const brands = await Brand.find();

  sendResponse(res, 200, 'All brands fetched successfully', brands);
});

// Allows admins to add a new brand
export const addNewBrand = handleAsync(async (req, res) => {
  const { name } = req.body;

  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    throw new CustomError(
      'Brand by this name already exists. Please provide a different brand name',
      409
    );
  }

  const brandId = new mongoose.Types.ObjectId();

  const response = await uploadImage(UPLOAD_FOLDERS.BRAND_LOGOS, req.file, brandId);

  const newBrand = await Brand.create({
    _id: brandId,
    name,
    logo: {
      url: response.secure_url,
      publicId: response.public_id,
    },
    createdBy: req.user._id,
  });

  sendResponse(res, 201, 'Brand added successfully', newBrand);
});

// Allows admins to update a brand
export const updateBrand = handleAsync(async (req, res) => {
  const { brandId } = req.params;
  const { name } = req.body;

  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw new CustomError('Brand not found', 404);
  }

  const existingBrand = await Brand.findOne({ name, _id: { $ne: brandId } });

  if (existingBrand) {
    throw new CustomError(
      'Brand by this name already exists. Please provide a different brand name',
      409
    );
  }

  await deleteImage(brand.logo.publicId);

  const response = await uploadImage(UPLOAD_FOLDERS.BRAND_LOGOS, req.file, brandId);

  const updatedBrand = await Brand.findByIdAndUpdate(
    brandId,
    {
      name,
      logo: {
        url: response.secure_url,
        publicId: response.public_id,
      },
      lastUpdatedBy: req.user._id,
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Brand updated successfully', updatedBrand);
});

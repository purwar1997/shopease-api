import { format } from 'date-fns';
import cloudinary from '../config/cloudinary.config.js';
import CustomError from '../utils/customError.js';

const generatePublicId = (folder, docId) => {
  const date = format(new Date(), 'yyyy/M/d');
  return `${folder}/${date}/${docId}`;
};

export const uploadImage = async (folder, file, docId) => {
  const options = {
    public_id: generatePublicId(folder, docId),
    asset_folder: folder,
  };

  try {
    const result = await cloudinary.uploader.upload(file.filepath, options);
    return result;
  } catch (error) {
    throw new CustomError('Failed to upload image', 500);
  }
};

export const deleteImage = async publicId => {
  const options = {
    invalidate: true,
  };

  try {
    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (error) {
    throw new CustomError('Failed to delete image', 500);
  }
};

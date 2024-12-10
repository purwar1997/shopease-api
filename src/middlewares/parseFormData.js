import formidable, { errors as formidableErrors } from 'formidable';
import fs from 'fs';
import url from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { capitalizeFirstLetter, singularize, formatBytes } from '../utils/helperFunctions.js';
import { FILE_UPLOAD } from '../constants/common.js';

const ensureUploadDirExists = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const parseFormData = (folder, filename) =>
  handleAsync(async (req, _res, next) => {
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const uploadDir = path.join(__dirname, '..', `uploads/${folder}`);
    ensureUploadDirExists(uploadDir);

    const options = {
      uploadDir,
      keepExtensions: true,
      maxFiles: FILE_UPLOAD.MAX_FILES,
      maxFileSize: FILE_UPLOAD.MAX_FILE_SIZE,
      filter: function ({ mimetype }) {
        const valid = mimetype && mimetype.includes('image');

        if (!valid) {
          form.emit(
            'error',
            new formidableErrors.default('Invalid file type. Only images are allowed', 0, 400)
          );
        }

        return valid;
      },
      filename: function (_, ext) {
        return `${uuidv4()}${ext}`;
      },
    };

    const form = formidable(options);

    form.on('error', error => {
      switch (error.code) {
        case 0:
          return next(new CustomError('Invalid file type. Only images are allowed', 400));

        case 1015:
          return next(
            new CustomError(
              `Upload limit exceeded. Only ${FILE_UPLOAD.MAX_FILES} ${
                MAX_FILES > 1 ? 'files are' : 'file is'
              } allowed`,
              400
            )
          );

        case 1009:
          return next(
            new CustomError(
              `File size limit exceeded. Maximum allowed size is ${formatBytes(
                FILE_UPLOAD.MAX_FILE_SIZE
              )}`,
              400
            )
          );

        default:
          return next(
            new CustomError(
              'Failed to parse form data. Please ensure the form data is correct',
              500
            )
          );
      }
    });

    const [fields, files] = await form.parse(req);

    if (!files[filename]) {
      throw new CustomError(
        `${capitalizeFirstLetter(singularize(folder)).replace(/-/g, ' ')} is required`,
        400
      );
    }

    for (const key in fields) {
      fields[key] = fields[key][0];
    }

    req.body = fields;
    req.file = files[filename][0];

    next();
  });

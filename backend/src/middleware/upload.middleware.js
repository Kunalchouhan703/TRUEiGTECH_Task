/**
 * File Upload Middleware
 * 
 * Configures Multer for handling file uploads.
 * Supports both post images and profile photos.
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads directory path
const uploadsDir = path.join(__dirname, '../../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

/**
 * Multer Storage Configuration
 * 
 * Stores files on disk with unique filenames.
 * Files are saved to: backend/uploads/
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save all files to uploads directory
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to prevent conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Determine prefix based on upload type (profile or post)
    const prefix = req.body.type === 'profile' ? 'profile-' : 'post-';
    
    // Preserve original file extension
    const extension = path.extname(file.originalname);
    
    // Create final filename: prefix-timestamp-random.extension
    cb(null, `${prefix}${uniqueSuffix}${extension}`);
  }
});

/**
 * File Filter Function
 * 
 * Only allows image files to be uploaded.
 * Validates both file extension and MIME type.
 * 
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Allowed image file extensions
  const allowedExtensions = /jpeg|jpg|png|gif|webp/;
  
  // Check file extension
  const hasValidExtension = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  
  // Check MIME type
  const hasValidMimeType = allowedExtensions.test(file.mimetype);

  // Allow upload if both extension and MIME type are valid
  if (hasValidExtension && hasValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed! (jpeg, jpg, png, gif, webp)'));
  }
};

/**
 * Multer Configuration
 * 
 * - storage: Where to store files (disk storage)
 * - limits: File size limit (5MB)
 * - fileFilter: Function to validate file types
 */
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB in bytes
  },
  fileFilter: fileFilter
});

/**
 * Get Image Path Helper
 * 
 * Generates the URL path for an uploaded image.
 * 
 * @param {string} filename - Name of the uploaded file
 * @returns {string} - URL path to the image
 */
export const getImagePath = (filename) => {
  return `/uploads/${filename}`;
};

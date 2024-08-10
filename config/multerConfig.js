// multerConfig.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Use 'auto' to accept images, videos, and other file types
    return {
      folder: 'social_network',
      resource_type: 'auto',
    };
  },
});

// Configure Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allowing specific MIME types
    const allowedMimeTypes = /jpeg|jpg|png|mp4|avi|mkv|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-word|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|vnd.openxmlformats-officedocument.presentationml.presentation|vnd.ms-powerpoint/;
    
    // Check MIME type and file extension
    const mimeType = allowedMimeTypes.test(file.mimetype);
    const extname = allowedMimeTypes.test(file.originalname.split('.').pop().toLowerCase());

    if (mimeType && extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, MP4, AVI, MKV, Word, Excel, and PowerPoint files are allowed.'));
    }
  }
}).array('files', 5); // Assurez-vous que 'files' correspond au nom du champ

export default upload;

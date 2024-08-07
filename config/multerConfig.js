import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social_network', // Nom du dossier sur Cloudinary
    allowed_formats: ['jpg', 'png', 'mp4'], // Formats autorisés
  },
});

const upload = multer({ storage });

export default upload;

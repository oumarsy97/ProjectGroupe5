// testCloudinary.js
// import cloudinary from './config/cloudinaryConfig.js';

// async function testCloudinary() {
//   try {
//     // Remplacez l'URL par une image valide sur votre système ou une URL d'image de test
//     const result = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg');
//     console.log('Upload result:', result);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// testCloudinary();

import cloudinary from './config/cloudinaryConfig.js';
import fs from 'fs';

// Fonction pour uploader un fichier
const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

// Test upload
uploadFile('https://res.cloudinary.com/demo/image/upload/sample.jpg')
  .then(result => {
    console.log('Upload result:', result);
  })
  .catch(error => {
    console.error('Upload error:', error);
  });

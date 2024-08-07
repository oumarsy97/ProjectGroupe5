import { Post } from '../Model/Post.js';

export default class PostController {
  static create = async (req, res) => {
    const { title, description } = req.body;
    const author = req.userId;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded', status: false });
    }

    try {
      // Obtenir les URLs Cloudinary des fichiers
      const contentUrls = files.map(file => file.path); // `file.path` contient l'URL Cloudinary

      const newPost = await Post.create({ title, description, content: contentUrls, author });
      res.status(201).json({ message: 'Post created successfully', data: newPost, status: true });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null, status: false });
    }
  };
}

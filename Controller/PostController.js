import {User} from '../Model/User.js';
import { Post } from '../Model/Post.js';

export default class PostController {
    static create = async (req, res) => {
        const { title, description, content } = req.body;
        const author = req.userId;
        try {
            const newPost = await Post.create({ title, description, content, author });
            res.status(201).json({ message: "Post created successfully", data: newPost, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }

    static share = async (req, res) => {
        const { postId } = req.params;
        const userId = req.userId;
        try {
            const user = await User.findById(userId);
            const post = await Post.findById(postId);
            if (!user || !post) {
                return res.status(404).json({ message: 'User or Post not found', status: false });
            }

            const whatsappUrl = `${process.env.WHATSAPP_URL}${user.phone}&text=${encodeURIComponent(post.description)}`;
            res.status(200).json({ message: 'Share URL generated successfully', data: whatsappUrl, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }
}

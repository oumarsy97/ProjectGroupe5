import { User } from '../Model/User.js';
import { Post } from '../Model/Post.js';
import { Discussion } from '../Model/Discussion.js';

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
        const { postId, recipientId } = req.body;
        const initiatorId = req.userId;

        try {
            const user = await User.findById(initiatorId);
            const post = await Post.findById(postId);
            const recipient = await User.findById(recipientId);

            if (!user || !post || !recipient) {
                return res.status(404).json({ message: 'Utilisateur ou post non trouvé', status: false });
            }

            const newDiscussion = await Discussion.create({
                post: postId,
                initiator: initiatorId,
                recipient: recipientId
            });

            return res.status(201).json({ message: 'Discussion créée avec succès', data: newDiscussion, status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    }

    static report = async (req, res) => {
        const { postId } = req.params;
        const { reason } = req.body;
        const reportedBy = req.userId;
        console.log(reportedBy);
        
        try {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found', status: false });
            }

            post.reports.push({ reportedBy, reason });
            await post.save();

            res.status(200).json({ message: 'Post reported successfully', data: post.reports, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }
}

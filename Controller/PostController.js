import { Post } from '../Model/Post.js';
import {User} from '../Model/User.js';

export default class PostController {
    static create = async (req, res) => {
        const { title, description, content } = req.body;
        const author = req.userId;
        try {
            const newPost = await Post.create({ title, description, content, author });
            res.status(201).json({ message: "post create successfully", data: newPost, status: false });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }
//get all posts
    static getAllPosts = async (req, res) => {
        try {
            const posts = await Post.aggregate([
                {
                    $lookup: {
                        from: 'users', 
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author' 
                    }
                },
                {
                    $unwind: '$author' // Décomposez le tableau de l'auteur pour obtenir un objet unique
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                       "firstname":'$author.firstname',
                        "lastname":'$author.lastname',
                        content: 1,
                        comments: 1,
                        likes: 1,
                        dislikes: 1,
                        views: 1,
                        visibility: 1,
                        mentions: 1,
                        repost: 1,
                        shares: 1,
                        createdAt: 1,
                        __v: 1
                    }
                }
            ]);
            res.status(201).json({message:"recup  posts saccessfully", data: posts,status: true});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    //get post by id
    static getPostById = async (req, res) => {
        try {
            const userId = req.userId;
            const postId = req.params.id;
            const post = await Post.findOne({  postId, userId }).populate('author', ['firstname', 'lastname']);
            if (!post) {
                return res.status(404).json({ message: "Post not found", data: null, status: false });
            }
            res.status(200).json({ message: "Post found", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    //delete post by id
    static deletePost = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (user.role!=="tailor") {
                res.status(403).json({message:"Only tailors can delete posts",data:null,status:false});
            }
            const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" ,data:null,status:false});
            }
            res.status(200).json({ message: "Post deleted", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //update post by id
    static updatePost = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (user.role!=="tailor") {
                res.status(403).json({message:"Only tailors can update posts",data:null,status:false});
            }
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!post) {
                return res.status(404).json({ message: "Post not found" ,data:null,status:false});
            }
            res.status(200).json({ message: "Post updated", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    //like post
    static likePost = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" ,data:null,status:false});
            }
            if (post.likes.includes(user._id)) {
                return res.status(400).json({ message: "You already like this post" ,data:null,status:false});
            }
            post.likes.push(user._id);
            await post.save();
            res.status(200).json({ message: "Post liked", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    //unlike post
    static unlikePost = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found" ,data:null,status:false});
            }
            if (post.dislikes.includes(user._id)) {
                return res.status(400).json({ message: "You haven't like this post" ,data:null,status:false});
            }
            post.likes.pull(user._id);
            await post.save();
            res.status(200).json({ message: "Post unliked", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

import { User,  Tailor,  } from "../Model/User.js";
import { Post } from '../Model/Post.js';
import { Discussion } from '../Model/Discussion.js';

export default class PostController {
    static create = async (req, res) => {
        const { title, description } = req.body;
        const idUser = req.userId;
        const files = req.files;
        const tailor = await Tailor.findOne({ idUser });  
        // console.log(tailor);  
        //verifer si il au moins 10 credits 
        if (tailor.credits < 10) {
          return res.status(400).json({ message: 'You do not have enough credits', status: false });
        }
     

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
        console.log(reportedBy, reason, postId);

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
            let author;
            const user = await User.findById(req.userId);
            if (user.role !== "tailor") {
                 author = req.params.id;
            }else{

                 author = req.userId;
            }
            const post = await Post.findOne({ author });
            console.log(post);
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
            if (user.role !== "tailor") {
                res.status(403).json({ message: "Only tailors can delete posts", data: null, status: false });
            }
            const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found", data: null, status: false });
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
            if (user.role !== "tailor") {
                res.status(403).json({ message: "Only tailors can update posts", data: null, status: false });
            }
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!post) {
                return res.status(404).json({ message: "Post not found", data: null, status: false });
            }
            res.status(200).json({ message: "Post updated", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    //like post
    static likePost = async (req, res) => {
        try {
            const likerId = req.userId; 
            const likedId = req.params.id; 

            console.log("likerId:", likerId);
            console.log("likedId:", likedId);

            const liker = await User.findById(likerId); 
            const post = await Post.findById(likedId); 
            // Vérification si l'utilisateur ou le post existe
            // if (!liker || !post) {
            //     return res.status(404).json({ message: "User or Post not found", data: null, status: false });
            // }
            const likeIndex = post.likes.findIndex(like => like.likerId.toString() === likerId);
            if (likeIndex !== -1) {
                // Si l'utilisateur a déjà liké le post, supprimez le like
                post.likes.splice(likeIndex, 1);
                await post.save();
                return res.status(200).json({ message: "Like removed", data: post, status: true });
            } else {
                // Si l'utilisateur n'a pas encore liké le post, ajoutez un like
                post.likes.push({ likerId, likedId });
                await post.save();
                return res.status(200).json({ message: "Post liked", data: post, status: true });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // static dislikePost = async (req, res) => {
    //     try {
    //         const dislikerId = req.userId; 
    //         const dislikedId = req.params.id; 

    //         console.log("likerId:", dislikerId);
    //         console.log("likedId:", dislikedId);

    //         const liker = await User.findById(dislikerId); 
    //         const post = await Post.findById(dislikedId); 
    //         // Vérification si l'utilisateur ou le post existe
    //         // if (!liker || !post) {
    //         //     return res.status(404).json({ message: "User or Post not found", data: null, status: false });
    //         // }
    //         const likeIndex = post.likes.findIndex(like => like.likerId.toString() === dislikerId);
    //         if (likeIndex !== -1) {
    //             // Si l'utilisateur a déjà liké le post, supprimez le like
    //             post.dislikes.splice(likeIndex, 1);
    //             await post.save();
    //             return res.status(200).json({ message: "Like removed", data: post, status: true });
    //         } else {
    //             // Si l'utilisateur n'a pas encore liké le post, ajoutez un like
    //             post.dislikes.push({ dislikerId, dislikedId });
    //             await post.save();
    //             return res.status(200).json({ message: "Post liked", data: post, status: true });
    //         }
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // }
    
    
    //repost 
    static repost = async (req, res) => {
        try {
            const { idPost } = req.params;
            const idUser = req.userId;
            const user = await User.findById(idUser);
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
            if (post.repost.includes(idUser)) return res.status(400).json({ message: "user already repost this post", data: null, status: 400 });
            //on ne peut pas reposter son propre post
            if (post.author == idUser) return res.status(400).json({ message: "you can't repost your post", data: null, status: 400 });
            post.repost.push(idUser);
            await post.save();
            res.status(200).json({ message: "Post reposted successfully", data: post, status: 200 });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: 500 });
        }
    }

    //delete repost
    static deleteRepost = async (req, res) => {
        try {
            const { idPost } = req.params;
            const idUser = req.userId;
            const user = await User.findById(idUser);
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
            if (!post.repost.includes(idUser)) return res.status(400).json({ message: "user not repost this post", data: null, status: 400 });
            const index = post.repost.indexOf(idUser);
            post.repost.splice(index, 1);
            await post.save();
            res.status(200).json({ message: "Post deleted from repost successfully", data: post, status: 200 });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: 500 });
        }
    }

    //comment a post
    static comment = async (req, res) => {
        try {
            const { idPost } = req.params;
            const idUser = req.userId;
            //   console.log(idPost, idUser);
            const { comment } = req.body;
            const user = await User.findById(idUser);
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
            const newComment = {
                user: user._id,
                text: comment,
            };
            post.comments.push(newComment);
            await post.save();
            res.status(200).json({ message: "Post commented successfully", data: post, status: 200 });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: 500 });
        }
    }

    //delete comment
    static deleteComment = async (req, res) => {
        try {
            const { idComment, idPost } = req.params;
            const idUser = req.userId;
            const user = await User.findById(idUser);
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
            // Trouver l'index du commentaire à supprimer
            const commentIndex = post.comments.findIndex(comment => comment._id.toString() === idComment);
            if (commentIndex === -1) {
                return { message: "Comment not found", data: null, status: 404 };
            }
            // Supprimer le commentaire du tableau
            post.comments.splice(commentIndex, 1);
            // Enregistrer les modifications
            await post.save();
            res.status(200).json({ message: "Post deleted from comment successfully", data: post, status: 200 });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: 500 });
        }
    }

}



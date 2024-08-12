import { User,  Tailor } from "../Model/User.js";
import { Post } from '../Model/Post.js';
import joi from "joi";
import { Chat } from '../Model/Chat.js';

export default class PostController {
    static create = async (req, res) => {
        const { title, description, gender, size } = req.body;
        const idUser = req.userId;
        const files = req.files;
    
        // Validation avec Joi
        const schema = joi.object({
            title: joi.string().required(),
            description: joi.string().required(),
            gender: joi.string().valid("homme", "femme", "enfant garçon", "enfant fille").required(),
            size: joi.string().valid("s", "xs", "m", "l", "xl", "xxl", "3xl").required(),
        });
    
        const { error } = schema.validate({ title, description, gender, size });
        if (error) {
            return res.status(400).json({ message: error.details[0].message, status: false });
        }
    
        try {
            const tailor = await Tailor.findOne({ idUser });
            if (!tailor) {
                return res.status(404).json({ message: 'Tailor not found', status: false });
            }
    
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded', status: false });
            }
    
            // Gestion des crédits et des posts gratuits
            let isFreePost = false;
            if (tailor.credits < 10) {
                if (tailor.freePostsUsed < 5) {
                    tailor.freePostsUsed += 1; // Incrémenter le nombre de posts gratuits utilisés
                    isFreePost = true;
                } else {
                    return res.status(400).json({ 
                        message: 'You have used all 5 free posts and do not have enough credits. Please recharge your account to continue posting.', 
                        status: false 
                    });
                }
            }
    
            // Obtenir les URLs Cloudinary des fichiers
            const contentUrls = files.map(file => file.path); // file.path contient l'URL Cloudinary
    
            // Créer le nouveau post avec la description enrichie
            const newPost = await Post.create({ 
                title, 
                description: { gender, size, text: description }, 
                content: contentUrls, 
                author: idUser 
            });
    
            // Déduire les crédits si le tailleur en a utilisé
            if (!isFreePost && tailor.credits >= 10) {
                tailor.credits -= 10;
            }
    
            await tailor.save();
    
            // Envoyer la réponse avec le nouveau post et le nombre de crédits restants
            res.status(201).json({ 
                message: isFreePost 
                    ? 'You have created a post using a free post. You have ' + (5 - tailor.freePostsUsed) + ' free posts remaining.' 
                    : 'Post created successfully', 
                data: newPost, 
                remainingCredits: tailor.credits,
                status: true 
            });
            // Gestion des crédits et des posts gratuits           
    
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }

    static share = async (req, res) => {
        const { postId, recipientIds, message } = req.body;
        const initiatorId = req.userId;

        // Limiter le nombre de destinataires à 5
        if (recipientIds.length > 5) {
            return res.status(400).json({ message: 'Vous ne pouvez pas partager un post avec plus de 5 destinataires.', status: false });
        }

        try {
            // Vérifier si le post existe
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé', status: false });
            }

            // Créer ou mettre à jour une discussion pour chaque destinataire
            const chats = [];
            for (const recipientId of recipientIds) {
                // Vérifier si une discussion existe déjà entre les utilisateurs
                let chat = await Chat.findOne({ initiator: initiatorId, recipient: recipientId });

                if (!chat) {
                    // Créer une nouvelle discussion si elle n'existe pas
                    chat = await Chat.create({
                        initiator: initiatorId,
                        recipient: recipientId,
                        messages: message ? [{
                            sender: initiatorId,
                            content: message,
                            timestamp: new Date(),
                            seen: false
                        }] : []
                    });
                } else if (message) {
                    // Ajouter le message à une discussion existante
                    chat.messages.push({
                        sender: initiatorId,
                        content: message,
                        timestamp: new Date(),
                        seen: false
                    });
                    await chat.save();
                }

                chats.push(chat);

                // Mettre à jour le post pour ajouter les partages
                await Post.updateOne(
                    { _id: postId },
                    { $addToSet: { 'shares': { user: initiatorId, recipient: recipientId } } }
                );
            }

            return res.status(200).json({ message: 'Post partagé avec succès', data: chats, status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    };

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
            author = req.params.id;
            if (!author) {
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
    //unlike post
    static dislikePost = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found", data: null, status: false });
            }
            if (!post.dislikes.includes(user._id)) {
                return res.status(400).json({ message: "You haven't like this post", data: null, status: false });
            }
            post.likes.pull(user._id);
            await post.save();
            res.status(200).json({ message: "Post unliked", data: post, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

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

   
    static noterPost = async (req, res) => {
        try {
            const { idPost } = req.body;
            const idUser = req.userId;
            const { note } = req.body;

            if (note < 1 || note > 5) {
                return res.status(400).json({ message: "La note doit être comprise entre 1 et 5", status: false });
            }

            const user = await User.findById(idUser);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé", data: null, status: 404 });

            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post non trouvé", data: null, status: 404 });

            const notesExist = post.notes.findIndex(r => r.userId.toString() === idUser);
            if (notesExist !== -1) {
                post.notes[notesExist].note = note;
            } else {
                post.notes.push({ userId: idUser, note });
            }

            const tailor = await Tailor.findOne({ idUser: post.author });
            if (tailor) {
                tailor.votes = (tailor.votes || 0) + note; // Increment votes by the note value
                await tailor.save();
            }

            await post.save();
            res.status(200).json({ message: "Post noté avec succès", data: post.notes, status: true });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
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

    static replyToComment = async (req, res) => {
        try {
            const { idPost, idComment } = req.params;
            const userId = req.userId;
            const { text } = req.body; // Retiré media

            // Trouver l'utilisateur
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            // Trouver le post
            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
            // Trouver le commentaire
            const comment = post.comments.id(idComment);
            if (!comment) return res.status(404).json({ message: "Comment not found", data: null, status: 404 });

            // Assurez-vous que response est initialisé comme un tableau
            if (!comment.response) {
                comment.response = [];
            }
            // Créer la nouvelle réponse
            const newReply = {
                user: user._id,
                text
            };
            // Ajouter la réponse au tableau
            comment.response.push(newReply);
            await post.save();

            res.status(200).json({ message: "Reply added successfully", data: post, status: 200 });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: 500 });
        }
    };

    static deleteReply = async (req, res) => {
        try {
            const { idPost, idComment, idReply } = req.params;
            const userId = req.userId;
            // Trouver l'utilisateur
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            // Trouver le post
            const post = await Post.findById(idPost);
            if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
            // Trouver le commentaire
            const comment = post.comments.id(idComment);
            if (!comment) return res.status(404).json({ message: "Comment not found", data: null, status: 404 });
            // Trouver l'index de la réponse à supprimer
            const replyIndex = comment.response.findIndex(reply => reply._id.toString() === idReply);
            if (replyIndex === -1) return res.status(404).json({ message: "Reply not found", data: null, status: 404 });
            // Supprimer la réponse
            comment.response.splice(replyIndex, 1);
            await post.save();
    
            res.status(200).json({ message: "Reply deleted successfully", data: post, status: 200 });
        } catch (error) {
            res.status(500).json({ message: error.message, data: null, status: 500 });
        }
    };    

    static viewPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const userId = req.userId;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found", status: false });
            }
            // Vérifier si l'utilisateur est un tailleur
            const isTailor = await Tailor.findOne({ idUser: userId });
            if (isTailor) {
                return res.status(403).json({ message: "Tailors cannot view their own posts", status: false });
            }
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found", status: false });
            }
            // Vérifier si l'auteur du post est le même que l'utilisateur actuel
            if (post.author.toString() === userId) {
                return res.status(403).json({ message: "You cannot view your own post", status: false });
            }
            post.views += 1;
            await post.save();

            res.status(200).json({ message: "Post viewed", data: post, status: true });
        } catch (error) {
            console.error("Error in viewPost:", error);
            res.status(500).json({ message: "An error occurred while viewing the post", error: error.message });
        }
    }
  




static deleteReply = async (req, res) => {
    try {
        const { idPost, idComment, idReply } = req.params;
        const userId = req.userId;

        // Trouver l'utilisateur
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });

        // Trouver le post
        const post = await Post.findById(idPost);
        if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });

        // Trouver le commentaire
        const comment = post.comments.id(idComment);
        if (!comment) return res.status(404).json({ message: "Comment not found", data: null, status: 404 });

        // Trouver l'index de la réponse à supprimer
        const replyIndex = comment.response.findIndex(reply => reply._id.toString() === idReply);
        if (replyIndex === -1) return res.status(404).json({ message: "Reply not found", data: null, status: 404 });

        // Supprimer la réponse
        comment.response.splice(replyIndex, 1);
        await post.save();

        res.status(200).json({ message: "Reply deleted successfully", data: post, status: 200 });
    } catch (error) {
        res.status(500).json({ message: error.message, data: null, status: 500 });
    }
};    

static viewPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: false });
        }

        // Vérifier si l'utilisateur est un tailleur
        const isTailor = await Tailor.findOne({ idUser: userId });
        if (isTailor) {
            return res.status(403).json({ message: "Tailors cannot view their own posts", status: false });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", status: false });
        }

        // Vérifier si l'auteur du post est le même que l'utilisateur actuel
        if (post.author.toString() === userId) {
            return res.status(403).json({ message: "You cannot view your own post", status: false });
        }

        post.views += 1;
        await post.save();

        res.status(200).json({ message: "Post viewed", data: post, status: true });
    } catch (error) {
        console.error("Error in viewPost:", error);
        res.status(500).json({ message: "An error occurred while viewing the post", error: error.message });
    }
}

static getTopTailors = async (req, res) => {
    try {
        const topTailors = await Tailor.find()
            .sort({ averageRating: -1, totalRatings: -1 })
            .limit(10)
            .populate('idUser', 'firtsname lastname')
            .select('totalRatings');
        const formattedTailors = topTailors.map(tailor => ({
            tailorname: `${tailor.idUser.firtsname} ${tailor.idUser.lastname}`,
            // averageRating: tailor.averageRating,
            totalRatings: tailor.totalRatings
        }));
        res.status(200).json({
            message: "Top tailors retrieved",
            data: formattedTailors,
            status: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
 
}



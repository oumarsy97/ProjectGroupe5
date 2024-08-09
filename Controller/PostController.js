import { User,  Tailor,  } from "../Model/User.js";
import { Post } from '../Model/Post.js';
import joi from "joi";

export default class PostController{
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
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    };
            

//get all posts
    static getAllPosts = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (user.role!=="tailor") {
                res.status(403).json({message:"Only tailors can list all posts",data:null,status:false});
            }
            const posts = await Post.find().populate('author', ['firstname', 'lastname']);
            res.status(201).json({message:"recup  posts saccessfully", data: posts,status: true});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //get post by id
    static getPostById = async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (user.role!=="tailor") {
                res.status(403).json({message:"Only tailors can list posts",data:null,status:false});
            }
            const post = await Post.findById(req.params.id).populate('author', ['firstname', 'lastname']);
            if (!post) {
                return res.status(404).json({ message: "Post not found" ,data:null,status:false});
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
    static delete = async (req, res) => {
        const { postId } = req.params;
        const userId = req.userId;
        try {
          const post = await Post.findById(postId);
          if (!post || post.author.toString()!== userId) {
            return res.status(404).json({ message: 'Post not found or not owned by the user', status: false });
          }
          await Post.findByIdAndDelete(postId);
          res.status(200).json({ message: 'Post deleted successfully', data: null, status: true });
        } catch (error) {
          res.status(400).json({ message: error.message, data: null, status: false });
        }
      }

     // getPostById 
 static getPostById = async (req, res) => {
        try {
            let author;
            const user = await User.findById(req.userId);
            author = req.params.id;
            if (!author) {
                author = req.userId
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
            console.log(likerId, likedId);
            const post = await Post.findById(likedId); 
            
            // Vérifier si l'utilisateur a déjà liké le post
            const likeIndex = post.likes.findIndex(like => like.likerId.toString() === likerId);
            
            if (likeIndex !== -1) {
                // Si l'utilisateur a déjà liké le post, retirer le like
                post.likes.splice(likeIndex, 1);
                await post.save();
                return res.status(200).json({ message: "Like removed", data: post, status: true });
            } else {
                // Retirer le dislike si l'utilisateur avait disliké le post
                const dislikeIndex = post.dislikes.findIndex(dislike => dislike.likerId.toString() === likerId);
                if (dislikeIndex !== -1) {
                    post.dislikes.splice(dislikeIndex, 1);
                }
                // Ajouter un like
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
            const dislikerId = req.userId; 
            const dislikedId = req.params.id; 
            const post = await Post.findById(dislikedId); 
            
            // Vérifier si l'utilisateur a déjà disliké le post
            const dislikeIndex = post.dislikes.findIndex(dislike => dislike.dislikerId.toString() === dislikerId);
            if (dislikeIndex !== -1) {
                // Si l'utilisateur a déjà disliké le post, retirer le dislike
                post.dislikes.splice(dislikeIndex, 1);
                await post.save();
                return res.status(200).json({ message: "Dislike removed", data: post, status: true });
            } else {
                // Retirer le like si l'utilisateur avait liké le post
                const likeIndex = post.likes.findIndex(like => like.likerId.toString() === dislikerId);
                if (likeIndex !== -1) {
                    post.likes.splice(likeIndex, 1);
                }
                // Ajouter un dislike
                post.dislikes.push({ dislikerId, dislikedId });
                await post.save();
                return res.status(200).json({ message: "Post disliked", data: post, status: true });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //repost 
  static repost = async (req, res) => {
    try {
      const { idPost } = req.params;
      const  idUser  = req.userId;
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      const post = await Post.findById(idPost);
      if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
      if(post.repost.includes(idUser)) return res.status(400).json({ message: "user already repost this post", data: null, status: 400 });
      //on ne peut pas reposter son propre post
      if(post.author==idUser) return res.status(400).json({ message: "you can't repost your post", data: null, status: 400 });
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
      const  idUser  = req.userId;
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
      const post = await Post.findById(idPost);
      if (!post) return res.status(404).json({ message: "Post not found", data: null, status: 404 });
      if(!post.repost.includes(idUser)) return res.status(400).json({ message: "user not repost this post", data: null, status: 400 });
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
      const  idUser  = req.userId;
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
      const { idComment,idPost } = req.params;
      const  idUser  = req.userId;
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

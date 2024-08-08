import express from 'express';
import PostController from '../Controller/PostController.js';
import Middleware from '../middlewares/Middleware.js';
import upload from '../config/multerConfig.js';

const PostRoute = express.Router();

// PostRoute.post('/create',Middleware.isanTailor, PostController.create);
PostRoute.get('/getPostById/:id', Middleware.isanTailor, PostController.getPostById);
PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, upload.array('files', 10), PostController.create);
PostRoute.get('/getAllPosts',Middleware.auth,Middleware.isanTailor, PostController.getAllPosts);
PostRoute.get('/comment/:idPost', Middleware.auth, PostController.comment);
PostRoute.delete('/comment/:idPost/:idComment', Middleware.auth, PostController.deleteComment);
PostRoute.get('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.repost);
PostRoute.delete('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.deleteRepost);
// Ajustement de la route pour mettre à jour la description d'un post
PostRoute.patch('/updateDescription/:id', Middleware.auth, Middleware.isanTailor, PostController.updateDescription);



export default PostRoute 


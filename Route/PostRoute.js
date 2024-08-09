import express from 'express';
import PostController from '../Controller/PostController.js';
import Middleware from '../middlewares/Middleware.js';
import upload from '../config/multerConfig.js';

const PostRoute = express.Router();

// PostRoute.post('/create',Middleware.isanTailor, PostController.create);
PostRoute.get('/getPostById/:id', Middleware.isanTailor, PostController.getPostById);
PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, upload, PostController.create);
PostRoute.post('/delete', Middleware.auth, Middleware.isanTailor, PostController.delete);
PostRoute.post('/update', Middleware.auth, Middleware.isanTailor, PostController.updatePost);
PostRoute.get('/getAllPosts',Middleware.auth,Middleware.isanTailor, PostController.getAllPosts);
PostRoute.post('/likePost/:id',Middleware.auth, PostController.likePost);
PostRoute.post('/dislikePost/:id',Middleware.auth, PostController.dislikePost);
PostRoute.get('/comment/:idPost', Middleware.auth, PostController.comment);
PostRoute.get('/getPostById',Middleware.auth, Middleware.isanTailor, PostController.getPostById);
PostRoute.get('/getPostById/:id',Middleware.auth, Middleware.isanTailor, PostController.getPostById);
PostRoute.delete('/comment/:idPost/:idComment', Middleware.auth, PostController.deleteComment);
PostRoute.get('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.repost);
PostRoute.delete('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.deleteRepost);


export default PostRoute 
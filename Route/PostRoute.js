import express from 'express';
import PostController from '../Controller/PostController.js';
import Middleware from '../middlewares/Middleware.js';
import upload from '../config/multerConfig.js';

const PostRoute = express.Router();

// PostRoute.post('/create',Middleware.isanTailor, PostController.create);
PostRoute.get('/getPostById/:id', Middleware.isanTailor, PostController.getPostById);
//PostRoute.get('/share/:postId', Middleware.auth, PostController.share);
PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, upload.array('files', 10), PostController.create);
PostRoute.get('/getAllPosts',Middleware.auth,Middleware.isanTailor, PostController.getAllPosts);
//PostRoute.get('/comment/:idPost', Middleware.auth, PostController.comment);
// PostRoute.delete('/comment/:idPost/:idComment', Middleware.auth, PostController.deleteComment);
// PostRoute.get('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.repost);
// PostRoute.delete('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.deleteRepost);
PostRoute.get('/getAllPosts', PostController.getAllPosts);
PostRoute.get('/getPostById',Middleware.auth, Middleware.isanTailor, PostController.getPostById);

export default PostRoute;

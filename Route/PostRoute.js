import express from 'express';
import PostController from '../Controller/PostController.js';
import Middleware from '../middlewares/Middleware.js';
import upload from '../config/multerConfig.js';

const PostRoute = express.Router();

PostRoute.get('/getPostById/:id', Middleware.isanTailor, PostController.getPostById);
PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, upload.array('files', 10), PostController.create);
PostRoute.get('/getAllPosts',Middleware.auth,Middleware.isanTailor, PostController.getAllPosts);
PostRoute.get('/getAllPosts', PostController.getAllPosts);
PostRoute.get('/getPostById',Middleware.auth, Middleware.isanTailor, PostController.getPostById);
PostRoute.get('/notePost', Middleware.auth, PostController.noterPost);
PostRoute.get('/comment/:idPost', Middleware.auth, PostController.comment);
PostRoute.delete('/comment/:idPost/:idComment', Middleware.auth, PostController.deleteComment);
PostRoute.post('/comment/:idPost/:idComment/reponse', Middleware.auth, PostController.replyToComment);
PostRoute.delete('/comment/:idPost/:idComment/reponse/:idReply', Middleware.auth, PostController.deleteReply);
PostRoute.get('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.repost);
PostRoute.delete('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.deleteRepost);
PostRoute.post('/report/:postId',Middleware.auth, Middleware.isanTailor, PostController.report);
PostRoute.post('/share', Middleware.auth, Middleware.isanTailor, PostController.share);
PostRoute.post('/view/:postId', Middleware.auth, PostController.viewPost);

export default PostRoute;
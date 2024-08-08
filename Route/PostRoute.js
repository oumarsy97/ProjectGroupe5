import express from 'express';
import PostController from '../Controller/PostController.js';
import Middleware from '../middlewares/Middleware.js';
import upload from '../config/multerConfig.js';

import PostController from "../Controller/PostController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const PostRoute = express.Router();

// PostRoute.post('/create',Middleware.isanTailor, PostController.create);
PostRoute.get('/getPostById/:id', Middleware.isanTailor, PostController.getPostById);
PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, upload.array('files', 10), PostController.create);
PostRoute.get('/getAllPosts',Middleware.auth,Middleware.isanTailor, PostController.getAllPosts);
PostRoute.get('/comment/:idPost', Middleware.auth, PostController.comment);
PostRoute.delete('/comment/:idPost/:idComment', Middleware.auth, PostController.deleteComment);
PostRoute.get('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.repost);
PostRoute.delete('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.deleteRepost);


export default PostRoute 
PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, PostController.create);
PostRoute.get('/share/:postId',Middleware.auth, Middleware.isanTailor, PostController.share);
PostRoute.post('/report/:postId',Middleware.auth, Middleware.isanTailor, PostController.report);

export default PostRoute; 

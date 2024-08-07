import PostController from "../Controller/PostController.js";

import express from "express";
import Middleware from "../middlewares/Middleware.js";
const PostRoute = express.Router();

PostRoute.post('/create',Middleware.auth,Middleware.isanTailor, PostController.create);
PostRoute.get('/getAllPosts',Middleware.auth,Middleware.isanTailor, PostController.getAllPosts);
PostRoute.get('/getPostById/:id',Middleware.auth, Middleware.isanTailor, PostController.getPostById);
PostRoute.get('/comment/:idPost', Middleware.auth, PostController.comment);
PostRoute.delete('/comment/:idPost/:idComment', Middleware.auth, PostController.deleteComment);
PostRoute.get('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.repost);
PostRoute.delete('/repost/:idPost',Middleware.auth, Middleware.isanTailor, PostController.deleteRepost);


export default PostRoute 
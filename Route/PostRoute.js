import PostController from "../Controller/PostController.js";

import express from "express";
import Middleware from "../middlewares/Middleware.js";
const PostRoute = express.Router();

PostRoute.post('/create',Middleware.auth,Middleware.isanTailor, PostController.create);
PostRoute.get('/getAllPosts', PostController.getAllPosts);
PostRoute.get('/getPostById',Middleware.auth, Middleware.isanTailor, PostController.getPostById);
export default PostRoute  
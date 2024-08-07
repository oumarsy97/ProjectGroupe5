import PostController from "../Controller/PostController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const PostRoute = express.Router();

PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, PostController.create);
PostRoute.get('/share/:postId',Middleware.auth, Middleware.isanTailor, PostController.share);
PostRoute.post('/report/:postId',Middleware.auth, Middleware.isanTailor, PostController.report);

export default PostRoute; 

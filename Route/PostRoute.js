import PostController from "../Controller/PostController.js";

import express from "express";
import Middleware from "../middlewares/Middleware.js";
const PostRoute = express.Router();

PostRoute.post('/create',Middleware.isanTailor, PostController.create);
export default PostRoute 
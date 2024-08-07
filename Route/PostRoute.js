import express from 'express';
import PostController from '../Controller/PostController.js';
import Middleware from '../middlewares/Middleware.js';
import upload from '../config/multerConfig.js';

const PostRoute = express.Router();

PostRoute.post('/create', Middleware.auth, Middleware.isanTailor, upload.array('files', 10), PostController.create);

export default PostRoute;

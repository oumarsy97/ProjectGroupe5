import FollowController from "../Controller/FollowController.js";
import Middleware from "../middlewares/Middleware.js";
import express from "express";

const router = express.Router();
router.post("/follow", Middleware.auth, FollowController.follow);
router.post("/unfollow", Middleware.auth, FollowController.unfollow);


export default router;
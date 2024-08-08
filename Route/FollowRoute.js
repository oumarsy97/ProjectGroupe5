import FollowController from "../Controller/FollowController.js";
import Middleware from "../middlewares/Middleware.js";
import express from "express";

const router = express.Router();
router.post("/follow", Middleware.auth, FollowController.follow);
router.post("/unfollow", Middleware.auth, FollowController.unfollow);
router.get("/getFollowers", Middleware.auth, FollowController.getFollowers);
router.get("/getFollowing", Middleware.auth, FollowController.getFollowing);
router.get("/getMyFollowers", Middleware.auth, FollowController.getMyFollowers);
router.get("/getMyFollowing", Middleware.auth, FollowController.getMyFollowing);


export default router;
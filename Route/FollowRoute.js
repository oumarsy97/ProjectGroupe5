import FollowController from "../Controller/FollowController.js";
import express from "express";

const router = express.Router();
router.post("/follow", FollowController.follow);
router.post("/unfollow", FollowController.unfollow);

export default router;
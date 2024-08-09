import { get } from "mongoose";
import StoryController from "../Controller/StoryController.js";
import Middleware from "../middlewares/Middleware.js";
import express from "express";

const router = express.Router();
router.post("/create", Middleware.auth,Middleware.isanTailor, StoryController.create);
router.delete("/delete/:idStory",Middleware.auth,Middleware.isanTailor, StoryController.deleteStory);
router.get("/storyfollowed",Middleware.auth, StoryController.getMyFollowingStories);
router.get("/mystories",Middleware.auth,Middleware.isanTailor, StoryController.getMyStories);
export default router;   
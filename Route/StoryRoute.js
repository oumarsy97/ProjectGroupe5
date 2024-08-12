import { get } from "mongoose";
import StoryController from "../Controller/StoryController.js";
import Middleware from "../middlewares/Middleware.js";
import express from "express";
import upload from '../config/multerConfig.js';

const router = express.Router();
router.delete("/delete/:idStory",Middleware.auth,Middleware.isanTailor, StoryController.deleteStory);
router.get("/storyfollowed",Middleware.auth, StoryController.getMyFollowingStories);
router.get("/mystories",Middleware.auth,Middleware.isanTailor, StoryController.getMyStories);
router.post("/create", Middleware.auth, Middleware.isanTailor, upload, StoryController.create); // Utiliser `array` avec le champ `files`
router.post("/view/:idStory", Middleware.auth, StoryController.viewStory);
router.get("/views/:idStory", Middleware.auth, StoryController.getStoryViews)
export default router;  

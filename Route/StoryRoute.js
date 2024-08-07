import StoryController from "../Controller/StoryController.js";
import express from "express";

const router = express.Router();
router.post("/create", StoryController.create);
router.delete("/delete/:idStory", StoryController.deleteStory);
export default router;
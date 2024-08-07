import StoryController from "../Controller/StoryController.js";
import Middleware from "../middlewares/Middleware.js";
import express from "express";

const router = express.Router();
router.post("/create", Middleware.auth,Middleware.isanTailor, StoryController.create);
router.delete("/delete/:idStory",Middleware.auth,Middleware.isanTailor, StoryController.deleteStory);
export default router;  
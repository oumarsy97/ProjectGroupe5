import StoryController from "../Controller/StoryController.js";
import Middleware from "../middlewares/Middleware.js";
import express from "express";
import upload from '../config/multerConfig.js';

const router = express.Router();
router.post("/create", Middleware.auth, Middleware.isanTailor, upload, StoryController.create); // Utiliser `array` avec le champ `files`
router.delete("/delete/:idStory", Middleware.auth, Middleware.isanTailor, StoryController.deleteStory);

export default router;

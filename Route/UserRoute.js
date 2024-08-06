import UserController from "../Controller/UserController.js";
import express from "express";

const router = express.Router();
router.post("/register", UserController.addUser);
router.post("/login", UserController.login);

export default router;
import UserController from "../Controller/UserController.js";
import express from "express";

const router = express.Router();
router.post("/register", UserController.addUser);
router.post("/login", UserController.login);
router.post("/addtailor", UserController.addTailor);
router.get("/gettailor", UserController.listTailor);
router.get("/", UserController.listUser);
export default router;
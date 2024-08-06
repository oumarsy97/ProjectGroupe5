import UserController from "../Controller/UserController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const router = express.Router();
router.post("/register", UserController.addUser);
router.post("/login", UserController.login);
router.post("/addtailor", UserController.addTailor);
router.get("/gettailor",Middleware.isanTailor, UserController.listTailor);
router.get("/", UserController.listUser); 
export default router;
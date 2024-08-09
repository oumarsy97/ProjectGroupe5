import express from "express";
import ChatController from "../Controller/ChatController.js";
import Middleware from "../middlewares/Middleware.js";

const ChatRoute = express.Router();

ChatRoute.post('/create', Middleware.auth, ChatController.createChat);
ChatRoute.post('/send/:chatId', Middleware.auth, ChatController.sendMessage);
ChatRoute.get('/:chatId', Middleware.auth, ChatController.getChatMessages);
ChatRoute.post('/mark-seen', Middleware.auth, ChatController.markMessageAsSeen);
ChatRoute.put('/update/:chatId/:messageId', Middleware.auth, ChatController.updateMessage);
ChatRoute.delete('/delete/:chatId/:messageId', Middleware.auth, ChatController.deleteMessage);

export default ChatRoute;
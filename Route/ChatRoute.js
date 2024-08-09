import express from "express";
import ChatController from "../Controller/ChatController.js";
import Middleware from "../middlewares/Middleware.js";
import upload from '../config/multerConfig.js';


const ChatRoute = express.Router();

ChatRoute.post('/create', Middleware.auth, upload.array('files'), ChatController.createChatAndSendMessage);
//ChatRoute.post('/send/:chatId', Middleware.auth, ChatController.sendMessage);
ChatRoute.get('/:chatId', Middleware.auth, ChatController.getChatMessages);
ChatRoute.post('/mark-seen', Middleware.auth, ChatController.markMessageAsSeen);
ChatRoute.put('/update/:chatId/:messageId', Middleware.auth, ChatController.updateMessage);
ChatRoute.delete('/delete/:chatId/:messageId', Middleware.auth, ChatController.deleteMessage);

export default ChatRoute;
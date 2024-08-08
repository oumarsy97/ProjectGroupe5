import { Chat } from "../Model/Chat.js";
import { User } from "../Model/User.js";
import mongoose from "mongoose";

const ChatController = {
    createChat: async (req, res) => {
        const { recipientId } = req.body;
        const initiatorId = req.userId;
        
        try {
            // Vérifiez si les utilisateurs existent
            const initiator = await User.findById(initiatorId);
            const recipient = await User.findById(recipientId);

            if (!initiator || !recipient) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', status: false });
            }

            // Créez une nouvelle discussion
            const newChat = await Chat.create({
                initiator: initiatorId,
                recipient: recipientId
            });

            return res.status(201).json({ message: 'Discussion créée avec succès', data: newChat, status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },

    sendMessage: async (req, res) => {
        const { chatId } = req.params;
        const { content } = req.body;
        const senderId = req.userId;

        try {
            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }

            // Ajoutez un nouveau message à la discussion
            const newMessage = {
                sender: senderId,
                content: content
            };

            chat.messages.push(newMessage);
            await chat.save();

            return res.status(201).json({ message: 'Message envoyé avec succès', data: newMessage, status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },

    getChatMessages: async (req, res) => {
        const { chatId } = req.params;

        try {
            const chat = await Chat.findById(chatId).populate('messages.sender', 'firstname lastname');

            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }

            return res.status(200).json({ message: 'Messages récupérés avec succès', data: chat.messages, status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },

    markMessageAsSeen: async (req, res) => {
        const { chatId, messageId } = req.body;

        try {
            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }

            const message = chat.messages.id(messageId);

            if (!message) {
                return res.status(404).json({ message: 'Message non trouvé', status: false });
            }

            message.seen = true;
            await chat.save();

            return res.status(200).json({ message: 'Message marqué comme lu', status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },

    updateMessage: async (req, res) => {
        const { chatId, messageId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        try {
            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }

            const message = chat.messages.id(messageId);

            if (!message) {
                return res.status(404).json({ message: 'Message non trouvé', status: false });
            }

            // Vérifiez que l'utilisateur est l'expéditeur du message et que le message a été envoyé dans les 2 dernières heures
            if (message.sender.toString() !== userId || (Date.now() - new Date(message.timestamp).getTime()) > 2 * 60 * 60 * 1000) {
                return res.status(403).json({ message: 'Modification non autorisée', status: false });
            }

            message.content = content;
            await chat.save();

            return res.status(200).json({ message: 'Message mis à jour avec succès', data: message, status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },

    deleteMessage: async (req, res) => {
        const { chatId, messageId } = req.params;
        const userId = req.userId;

        try {
            const chat = await Chat.findById(chatId);

            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }

            const message = chat.messages.id(messageId);

            if (!message) {
                return res.status(404).json({ message: 'Message non trouvé', status: false });
            }

            // Vérifiez que l'utilisateur est l'expéditeur du message et que le message a été envoyé dans les 2 dernières heures
            if (message.sender.toString() !== userId || (Date.now() - new Date(message.timestamp).getTime()) > 2 * 60 * 60 * 1000) {
                return res.status(403).json({ message: 'Suppression non autorisée', status: false });
            }

            // Utilisez la méthode pull pour supprimer le message
            chat.messages.pull(messageId);
            await chat.save();

            return res.status(200).json({ message: 'Message supprimé avec succès', status: true });
        } catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    }
};

export default ChatController;

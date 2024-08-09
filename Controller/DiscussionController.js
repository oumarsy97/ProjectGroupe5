// Controller/DiscussionController.js
import {Discussion} from '../Model/Discussion.js';
import {Post} from '../Model/Post.js';
import {User} from '../Model/User.js';

class DiscussionController {
    static startDiscussion = async (req, res) => {
        const { recipientId, postId, message } = req.body;
        const senderId = req.userId;

        try {
            const sender = await User.findById(senderId);
            const recipient = await User.findById(recipientId);
            const post = postId ? await Post.findById(postId) : null;

            if (!sender || !recipient) {
                return res.status(404).json({ message: 'Sender or recipient not found', status: false });
            }

            const discussion = await Discussion.create({
                participants: [senderId, recipientId],
                post: postId ? postId : undefined,
                messages: [{
                    sender: senderId,
                    content: message,
                }]
            });

            res.status(201).json({ message: 'Discussion started successfully', data: discussion, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }

    static sendMessage = async (req, res) => {
        const { discussionId, content } = req.body;
        const senderId = req.userId;

        try {
            const discussion = await Discussion.findById(discussionId);

            if (!discussion) {
                return res.status(404).json({ message: 'Discussion not found', status: false });
            }

            await Discussion.findByIdAndUpdate(discussionId, {
                $push: {
                    messages: {
                        sender: senderId,
                        content: content,
                    }
                }
            });

            res.status(200).json({ message: 'Message sent successfully', status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }

    static markMessagesAsSeen = async (req, res) => {
        const { discussionId } = req.params;
        const userId = req.userId;

        try {
            const discussion = await Discussion.findById(discussionId);

            if (!discussion) {
                return res.status(404).json({ message: 'Discussion not found', status: false });
            }

            await Discussion.updateMany(
                { _id: discussionId, 'messages.seenBy': { $ne: userId } },
                { $push: { 'messages.$[message].seenBy': userId } },
                { arrayFilters: [{ 'message.sender': { $ne: userId } }], multi: true }
            );

            res.status(200).json({ message: 'Messages marked as seen', status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }

    static getDiscussions = async (req, res) => {
        const userId = req.userId;

        try {
            const discussions = await Discussion.find({
                participants: userId,
            }).populate('participants', 'firstname lastname email').populate('messages.sender', 'firstname lastname');

            res.status(200).json({ message: 'Discussions retrieved successfully', data: discussions, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }
}

export default DiscussionController;
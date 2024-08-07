import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google's DNS servers
import { Follow, validateFollow } from "../Model/Follow.js";

export default class FollowController {
    static follow = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        try {
            const { followerId, followedId } = req.body;
            let follower = await User.findById(followerId);
            let followed = await User.findById(followedId);
            if (!follower || !followed) return res.status(400).json({ error: "User not found" });
            let follows = await Follow.findOne({ followerId, followedId });
            if (follows) return res.status(400).json({ error: "Follow already exists" });
            const follow = await Follow.create({ followerId, followedId });
            res.status(201).json(follow);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static unfollow = async (req, res) => {
        try {
            const { id } = req.body;
            const follow = await Follow.findOneAndDelete({ id });
            res.status(200).json(follow);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
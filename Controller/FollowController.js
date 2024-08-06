import dns from 'dns';
import { User, Tailor } from "../Model/User.js";
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google's DNS servers
import { Follow, validateFollow } from "/home/fatoumata/Bureau/Node/ProjetGroupe5/ProjectGroupe5/Model/Follow.js";

export default class FollowController {
    static follow = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        try {
            const followedId = req.body.followedId;
            const followerId = req.userId;
            if (followerId == followedId) return res.status(400).json({ error: "You cannot follow yourself" });
            let follower = await User.findById(followerId);
            // console.log(followedId);
            let followed = await Tailor.findById(followedId);
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
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        try {
            const followedId = req.body.followedId;
            const followerId = req.userId;
            const follow = await Follow.findOneAndDelete({ followerId, followedId });
            if (!follow) return res.status(400).json({ error: "Follow not found" });
            res.status(200).json(follow);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
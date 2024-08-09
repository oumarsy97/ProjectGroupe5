import dns from 'dns';
import { User, Tailor } from "../Model/User.js";
import mongoose from "mongoose";
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google's DNS servers
import { Follow, validateFollow } from "../Model/Follow.js";

export default class FollowController {
    static follow = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        try {
            const followedId = req.body.followedId;
            const followerId = req.userId;
            console.log(req.body);
            if (followerId == followedId) return res.status(400).json({ error: "You cannot follow yourself" });
            let follower = await User.findById(followerId);
            let followed = await User.findById(followedId);
            //console.log(followed);
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

    static getFollowers = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
    
        try {
            let followedId;
            followedId = req.params.id;
            if (!followedId) {
                followedId = req.userId;
            }
            const objectId = new mongoose.Types.ObjectId(followedId);
            console.log("id"+objectId);
            const followers = await Follow.find({ followedId: objectId });
            console.log(followers);
    
            res.status(200).json(followers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }  

    static getFollowing = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
    
        try {
            let followerId;
            followerId = req.params.id;
            if (!followerId) {
                followerId = req.userId;
            }
            const objectId = new mongoose.Types.ObjectId(followerId);
            console.log("id"+objectId);
            const followers = await Follow.find({ followerId: objectId });
            console.log(followers);
    
            res.status(200).json(followers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getMyFollowers = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        try {
            const followerId = req.userId;
            const followers = await Follow.find({ followedId: followerId });
            res.status(200).json(followers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getMyFollowing = async (req, res) => {
        const { error } = validateFollow(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        try {
            const followedId = req.userId;
            const following = await Follow.find({ followerId: followedId });
            res.status(200).json(following);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
import Followers from "../models/follower.model.js";
import asyncHandler from "express-async-handler";

const followUser  = asyncHandler(async(req,res)=>{

    const { Author} = req.body;
    const Follower = req.user._id;
    if (!Author) {
        res.status(400);
        throw new Error("Author is required");
    }
    try {
        const flow = await Followers.create({
            Author,
            Follower
        });
        const newflow  = await Followers.findById(flow._id).populate('Author', 'name avatar');
        res.status(201).json(newflow);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
const unfollowUser = asyncHandler(async(req,res)=>{
    const { Author } = req.body;
    const Follower = req.user._id;
    if (!Author) {
        res.status(400);
        throw new Error("Author is required");
    }
    try {
        const flow = await Followers.findOneAndDelete({_id:Author , Follower:Follower} );
        if (!flow) {
            res.status(404).json({ message: "Follow relationship not found" });
        } else {
            res.status(200).json({ message: "Unfollowed successfully" });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
const getFollowers = asyncHandler(async (req, res) => {
 
    const userId =   req.user._id;
    try {
        const followers = await Followers.find({ Author: userId }).populate('Follower', 'name avatar');
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getFollowing = asyncHandler(async (req, res) => {
    
    const userId =  req.user._id;
    try {
        const following = await Followers.find({ Follower: userId }).populate('Author', 'name avatar');
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getFollowersvisitor = asyncHandler(async (req, res) => {

    const userId =   req.params.id;
    try {
        const followers = await Followers.find({ Author: userId }).populate('Follower', 'name avatar');
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getFollowingvisitor = asyncHandler(async (req, res) => {

    const userId =  req.params.id;
    try {
        const following = await Followers.find({ Follower: userId }).populate('Author', 'name avatar');
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { followUser, unfollowUser, getFollowers, getFollowing , getFollowersvisitor, getFollowingvisitor };
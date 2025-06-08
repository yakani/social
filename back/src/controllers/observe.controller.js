import Observe from "../models/observe.model.js";
import asyncHandler from "express-async-handler";

const addObserve = asyncHandler(async(req,res)=>{
    const { likes, save, dislikes } = req.body;
    const userId = req.user._id;
    let createdObserve;
    try {
        const existingUser = await Observe.findOne({ userId});
        
        if(!existingUser) {
        let likesarr = likes ? [likes] : [];
        let savesarr = save ? [save] : [];
        let dislikesarr = dislikes ? [dislikes] : [];
             createdObserve = await Observe.create({
                userId,
                likes: likesarr,
                saves: savesarr,
                dislikes: dislikesarr
            });
            createdObserve = await createdObserve.populate('likes saves dislikes','prompt');
        }else {
            let savesarr = save ? [...existingUser.saves, save]:[];
            let dislikesarr = dislikes  ? [...existingUser.dislikes, dislikes] : [];
            let likesarr = likes ? [...existingUser.likes, likes] : [];
            existingUser.likes = likes && !existingUser.likes.includes(likes) ? likesarr : existingUser.likes;
            existingUser.saves = save && !existingUser.saves.includes(save) ? savesarr : existingUser.saves;
            existingUser.dislikes = dislikes && !existingUser.dislikes.includes(dislikes) ? dislikesarr : existingUser.dislikes;
            createdObserve = await existingUser.save();
            createdObserve = await createdObserve.populate('likes saves dislikes','prompt');
        }
    res.status(201).json(createdObserve);

    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
   
});
export { addObserve };
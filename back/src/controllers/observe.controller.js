import Observe from "../models/observe.model.js";
import asyncHandler from "express-async-handler";

const addObserve = asyncHandler(async(req,res)=>{
    const { likes, save, dislikes } = req.body;
    const userId = req.user._id;
    try {
        const existingUser = await Observe.findOne({ userId});
        if(!existingUser) {
        let likesarr = likes ? [likes] : [];
        let savesarr = save ? [save] : [];
        let dislikesarr = dislikes ? [dislikes] : [];
           const  createdObserve = await Observe.create({
                userId,
                likes: likesarr,
                saves: savesarr,
                dislikes: dislikesarr
            });
            
        }else {
            let savesarr = save ? [...existingUser.saves, save]:[];
            let dislikesarr = dislikes  ? [...existingUser.dislikes, dislikes] : [];
            let likesarr = likes ? [...existingUser.likes, likes] : [];
            existingUser.likes = likes && !existingUser.likes.includes(likes) ? likesarr : existingUser.likes;
            existingUser.saves = save && !existingUser.saves.includes(save) ? savesarr : existingUser.saves;
            existingUser.dislikes = dislikes && !existingUser.dislikes.includes(dislikes) ? dislikesarr : existingUser.dislikes;
             await existingUser.save();
        }
        const final  = await Observe.findOne({ userId }).populate('likes','prompt').populate('saves','prompt').populate('dislikes','prompt');

    res.status(201).json(final);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
   
});
 const getObservation = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    try {
        const observation = await Observe.findOne({ userId }).populate('likes', 'prompt');
        if (!observation) {
            return res.status(404).json({ message: 'No observation found' });
        }
        let last;
        let final= [];
        observation.likes.forEach(element =>{
            if (last === element.prompt) return;
            const num = observation.likes.filter(item => item.prompt === element.prompt
                || (item.prompt.includes(element.prompt.split('#')[0]) && item.prompt.includes(element.prompt.split('#')[1]))).length;
                final.push({
                    prompt: element.prompt,
                    count: num
                });
                last = element.prompt;
        });
        final.sort((a, b) => b.count - a.count);
        const arr = final.map(item => item.prompt);
        res.status(200).json(arr);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getVisualization =  asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    try {
        const observation = await Observe.findOne({ userId });
        if (!observation) {
            return res.status(404).json({ message: 'No observation found' });
        }
     res.status(200).json(observation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export { addObserve, getObservation, getVisualization };
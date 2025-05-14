import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from '../lib/socket.js';
const createCOmment = asyncHandler(async (req,res)=>{
    const { content } = req.body;
    const { id } = req.params;
    let fileurl = null;
    const image  = req.files.file ? req.files.file[0] : null ;

    if(image){
        const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    resource_type: 'auto',
                    folder: 'uploads',
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                );
          
                uploadStream.end(image.buffer);
              });
        fileurl = result.secure_url;
    }
    try {
        let comment = await Comment.create(
            {
                sender: req.user._id,
                post: id,
                content,
                path:fileurl
            }
        );

        if(!comment){
            return res.status(400).json({message:"failed to insert"});
        }
        comment = await Comment.findById(comment._id).populate('sender','avatar name');
        io.emit("comments", comment);
        res.status(201).json(comment);
    } catch (error) {
       res.status(500).json({message:error}) ;
    }
});
const getComments = asyncHandler(async(req,res)=>{
        const { id } = req.params;
        try {
            const comment = await Comment.find({post : id}).populate('sender','avatar name');
            if(!comment){
                return res.status(404).json({message:"post not found"});
            }
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({message:error})
        }
});
const deleteComment = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const comment  = await Comment.findByIdAndDelete(id);
        if(!comment){
            return res.status(404).json({message:"post not found"});
        }
        res.status(201).json({message: "ok delete"});
    } catch (error) {
        res.status(500).json({message:error});
    }
});
export {
    createCOmment,
    deleteComment,
    getComments
}
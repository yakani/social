import asyncHandler from 'express-async-handler';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { io ,getusersocketid } from '../lib/socket.js'

const createMessage = asyncHandler(async (req, res) => {
    const {content } = req.body;
    const { id } = req.params;
    const text = content ? content : null;
    const file =  req.files.file ? req.files.file[0] : null;
    try {
        let fileurl = null;
        if (file) {
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
              
                    uploadStream.end(file.buffer);
                  });
            fileurl = result.secure_url;
        }
        const message = await Message.create({
            sender: req.user._id,
            receiver: id,
            content:text,
            file: fileurl,
        });
        const receverid = getusersocketid(req.params.id);
        if(receverid){
            io.to(receverid).emit("msg",message,req.user.name);
        }
        res.status(201).json(message);
        
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: id },
                { sender: id, receiver: req.user._id },
            ],
        })
            
            .populate('receiver', 'name email avatar createdAt')
            .sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
const deleteMessage = asyncHandler(async (req,res)=>{
    const {id } = req.params;
    try {
        await Message.findByIdAndDelete(id);
        res.status(200).json({message:"delete"});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
export {
    deleteMessage,
    getMessages,
    createMessage
}
import asyncHandler from 'express-async-handler';
import cloudinary from "../lib/cloudinary.js";
import File  from '../models/file.model.js';


const createFile = asyncHandler(async (req,res)=>{
    const {  prompt , title } = req.body;
    let fileurl = null;
    let thumbailUrl =null;
    const file = req.files.file[0];
    if(file.mimetype.startsWith('image')){
        const uploadimg  = await new Promise((resolve, reject) => {
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
        thumbailUrl = uploadimg.secure_url;
    }else{
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
        const thumbnail = result.public_id.replace(/\.[^/.]+$/, ""); // Remove extension
      thumbailUrl = cloudinary.url(thumbnail, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto' }
          ]
        });
    }
try {
    
    const file  = await File.create({
        sender :req.user._id,
        path:fileurl,
        thumbnail:thumbailUrl,
        prompt,
        title
    });
    if(!file){
        return res.status(400).json({message:"failed to insert"});
    }
    const newfile  = await File.findById(file._id).populate('sender','name avatar');
    res.status(201).json(newfile);
    
} catch (error) {
    console.log(error);
    res.status(500).json({message:error});
}
});
const getFileByuser = asyncHandler(async (req,res)=>{
       try {
        
        const id =  req.user._id;
        const file = await File.find({ sender : id }).populate('sender','avatar name email').sort({createdAt:-1});
        res.status(201).json(file);
       } catch (error) {
        console.log(error);
       } 
});
const getFileByvisitor = asyncHandler(async (req,res)=>{
       try {
        
        const {id } =  req.params;
        const file = await File.find({ sender : id }).populate('sender','avatar name email').sort({createdAt:-1});
        res.status(201).json(file);
       } catch (error) {
      
        res.status(500).json({message:error});
       } 
});

const getAllFiles = asyncHandler(async (req,res)=>{

    const file = await File.find({$nor:[{sender:req.user._id}]}).populate('sender','avatar name email');

    res.status(201).json(file ? file :[]);
});
const deleteFile = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    try {
        await File.findByIdAndDelete(id);
        res.status(201).json({message:"deleted"});
    } catch (error) {
        res.status(500).json({message:error});
    }
});
const getFileById = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    try {
        const file = await File.findById(id).populate('sender','avatar name ');
        if(!file){
            return res.status(404).json({message:"file not found"});
        }
        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({message:error});
    }
});
export {
    createFile,
    getAllFiles,
    getFileByuser,
    getFileByvisitor,
    getFileById,
    deleteFile
}
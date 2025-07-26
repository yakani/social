import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import generatetoken from '../midlleware/generate.token.js';
import cloudinary from '../lib/cloudinary.js';
import generateTokenApp from '../midlleware/generte.app.token.js';
const Signup = asyncHandler(async (req, res) =>{
    const { name, email, password } = req.body;
   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return  res.status(400).json({ message: 'User already exists' });
    }
    try {
        const user = await User.create({
            name,
            email,
            password,
        });
        if (!user) {
          res.status(400).json({ message: 'error aumit' });
        } 
        generatetoken(res, user._id);
        if(req.query?.app){
         const  tokens = generateTokenApp(user._id);
            return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
            });
        }
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }
} );
const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
       return  res.status(401).json({ message: 'Invalid email or password' });
    }
    try {
        if (!(await user.matchPasswords(password))) {
             res.status(401).json({ message: 'Invalid email or password' });
        }
          if(req.query?.app){
         const  tokens = generateTokenApp(user._id);
            return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
            });
        }
         generatetoken(res, user._id);
         res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
   
});
const Logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logout successful' });
});
const Checkuser = asyncHandler(async (req, res) => {
    
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }
    res.status(200).json(req.user);
});
const UpdateUser = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        user.name = name || user.name;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}
);
const Updatepic = asyncHandler(async (req, res) => {
    const  pic  = req.files.file[0];
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const result  = await new Promise((resolve, reject) => {
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
      
            uploadStream.end(pic.buffer);
          });
    try {
        user.avatar = result.secure_url;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
const GetAlluser = asyncHandler(async(req,res)=>{
try {
    const user  = await User.find({_id :{$ne:req.user._id}}).select("-password");
    if(!user){
        return res.status(400).json({message:"failed to load user"});
    }
    res.status(201).json(user);
} catch (error) {
    res.status(500).json({ message: error });
}
});
export {
    Signup,
    Login,
    Logout,
    Checkuser,
    UpdateUser,
    Updatepic,
    GetAlluser
};
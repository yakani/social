import generatetoken from '../midlleware/generate.token.js';
import asyncHandler from 'express-async-handler';
import generateTokenApp from '../midlleware/generte.app.token.js';
import User from '../models/user.model.js';
const redirectClient = asyncHandler(async(req,res)=>{
    generatetoken(res,req.user._id);
    res.redirect(`${process.env.CLIENT_URL}`)
});
const googleTokenAuth =  asyncHandler( async (req, res) => {
  const { name , email , id } = req.body;

  try {
    let user = await User.findOne({ email }).select('-password -googleId');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateTokenApp(user._id);
    user = {
      ...user._doc,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
    };
    // You may want to generate a JWT or session here
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid Google token", error });
    console.log(error);
  }
});
const SignupToken = asyncHandler(async (req, res) => {
  const { name , email , id } = req.body;

  try {
    let user = await User.findOne({ email }).select('-password  -googleId');

    if (user) {
     return res.status(409).json({ message: "User already exists" });
    }
    user = await User.create({
        email,
        name,
        password: "password",
        googleId:id
      });
    const token = generateTokenApp(user._id);
    const newuser  = await User.findById(user._id).select('-password -googleId');
    user = {
        ...newuser._doc,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
    };
    // You may want to generate a JWT or session here
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid Google token", error });
     console.log(error);
  }
});
export {
    redirectClient,
    googleTokenAuth,
    SignupToken
}
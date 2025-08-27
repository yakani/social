import generatetoken from '../midlleware/generate.token.js';
import asyncHandler from 'express-async-handler';
import generateTokenApp from '../midlleware/generte.app.token.js';
import User from '../models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
const redirectClient = asyncHandler(async(req,res)=>{
    generatetoken(res,req.user._id);
    res.redirect(`${process.env.CLIENT_URL}`)
});
const googleTokenAuth = async (req, res) => {
  const { accessToken } = req.body;
  const client = new OAuth2Client(process.env.clientID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.clientID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: payload.name,
        password: "password",
      });
    }
    const token = generateTokenApp(user._id);
    user = {
        ...user,
        accessToken:token.accessToken,
        refreshToken:token.refreshToken
    };
    // You may want to generate a JWT or session here
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid Google token", error });
  }
};
export {
    redirectClient,
    googleTokenAuth
}
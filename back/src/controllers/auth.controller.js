import generatetoken from '../midlleware/generate.token.js';
import asyncHandler from 'express-async-handler';
import generateTokenApp from '../midlleware/generte.app.token.js';
const redirectClient = asyncHandler(async(req,res)=>{
    const app = req.body?.app || null;
    if(app){
        const token = generateTokenApp(req.user._id);
        return res.status(200).json({
            _id:req.user._id,
            name:req.user.name,
            avatar:req.user.avatar,
            email:req.user.email,
            role:req.user.role,
            accessToken:token.accessToken,
            refreshToken:token.refreshToken
        });
    }
    generatetoken(res,req.user._id);
    res.redirect(`${process.env.CLIENT_URL}`)
});
export {
    redirectClient
}
import generatetoken from '../midlleware/generate.token.js';
import asyncHandler from 'express-async-handler';
const redirectClient = asyncHandler(async(req,res)=>{
    generatetoken(res,req.user._id);
    res.redirect(`${process.env.CLIENT_URL}`)
});
export {
    redirectClient
}
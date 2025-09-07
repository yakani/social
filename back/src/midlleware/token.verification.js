import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js'
const protect=asyncHandler( async (req, res, next)=>{
let token;
let refresh = req.cookies.refresh ;
if(req.query?.app){
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];     
      const decoded = jwt.verify(token, process.env.jwts);
      req.user = await User.findById(decoded.id).select('-password -googleId');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
    if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  return;

}

try{
	if(req.cookies.refresh)
	{
		const decode = jwt.verify(refresh,process.env.refresh);
		//console.log(decode.id);
		if(req.cookies.jwt != decode.id){throw new Error('timeout login back');}
		
	}
	if (req.cookies.jwt) {
		token = req.cookies.jwt;
		const decoded = jwt.verify(token, process.env.jwts);
		req.user = await User.findById(decoded.id).select('-password');
		next();

}else{
	throw new Error('not authorize no token');
}

}catch(error){
	res.status(401)
	throw new Error(error);

}

});
export default protect;
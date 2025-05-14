import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js'
const protect=asyncHandler( async (req, res, next)=>{
let token;
let refresh = req.cookies.refresh ;
token=req.cookies.jwt;
//console.log(token);


try{
	if(req.cookies.refresh)
	{
		const decode = jwt.verify(refresh,process.env.refresh);
		//console.log(decode.id);
		if(token != decode.id){throw new Error('timeout login back');}
		
	}
	if (req.cookies.jwt) {
		const decoded= jwt.verify(token, process.env.jwts);
		req.user= await User.findById(decoded.id).select('-password');
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
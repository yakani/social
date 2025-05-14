import jwt from 'jsonwebtoken';

const generatetoken=(res,id)=>{
	const token= jwt.sign({id}, process.env.jwts,{
		expiresIn:"7d",

	});
    const refreshtoken = jwt.sign( {id:token} ,process.env.refresh,{
        expiresIn:"7d"
    });
    res.cookie('jwt',token,{
        secure:true,
        sameSite:'none',
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        
    })
    res.cookie('refresh',refreshtoken,{
        secure:true,
        sameSite:'none',
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    })
    
}
export default generatetoken;
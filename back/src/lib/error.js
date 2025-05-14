const errorhandeler=(err,req,res,next)=>{
    let statusCode = (res.statusCode == null) ? 500: res.statusCode;
    let message=err.message;
    if (err.name=='CastError' && err.kind=='ObjectId') {
        statusCode = 404;
        message = "resources not found ";
    }
    let stackerr= (process.env.node!="developement") ? err.stack : null;
    return res
    .status(statusCode)
    .json({
        msg:message,
        stack:stackerr
    });
};
const notfound=(req,res,next)=>{
    const err= new Error('not found'+req.originalUrl);
    res.status(404);
    next(err);
}
export {errorhandeler,notfound} ;
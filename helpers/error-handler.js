function errorHandler (err,req,res,next){
    //jwt error
if(err.name==="UnauthorizedError"){
    return res.status(401).json({
        message:"The user is not authorized"
    })
}
//validation error in image uploading
if(err.name==="ValidationError"){
    return res.status(401).json({
        message:err
    })
}
return res.status(500).json(err)
}

module.exports = errorHandler;
const jwt=require('jsonwebtoken');
const User=require('../models/user.model');
const ApiError=require('../utils/ApiError');
const asyncHandler=require('../utils/asyncHandler');

const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token=req.headers.authorization || req.cookies?.accessToken;
    if(!token){
        throw new ApiError(401, "Unauthorized as token not found in request headers or cookies");
    }
    if(token.startsWith('Bearer')){
        token=token.split(' ')[1];
    }
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findOne({user_id: decoded.user_id});
        if(!user){
            throw new ApiError(401, "Unauthorized");
        }
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }

});
module.exports=verifyJWT;
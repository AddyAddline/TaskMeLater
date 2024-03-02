
const {UserPriority} = require("../utils/enums");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const registerUser= asyncHandler(async (req, res) => {
    const {phoneNumber, priority}=req.body;

    //validate 
    if (!phoneNumber || priority===undefined || priority===null) {
       throw new ApiError(400, "Phone number and priority are required")
    }
    if(phoneNumber.length!==10){
        throw new ApiError(400, "Phone number must be 10 digits");
    }
    if(!Object.values(UserPriority).includes(priority)){
        throw new ApiError(400, "Priority must be 0, 1 or 2(not a string)");
    }
    //check if user already exists
    const user= await User.findOne({
        phone_number: phoneNumber,
    });
    if(user){
        throw new ApiError(400, "User already exists");
    }
    //create user
    const newUser= new User({
        phone_number: phoneNumber,
        priority: priority,
    });
    await newUser.save();
    res.status(201).json({
        success: true,
        message: "User created successfully",
    });


});

const loginUser= asyncHandler(async (req, res) => {
    const {phoneNumber}=req.body;
    //validate
    if(!phoneNumber){
        throw new ApiError(400, "Phone number is required");
    }
    if(phoneNumber.length!==10){
        throw new ApiError(400, "Phone number must be 10 digits");
    }
    //check if user exists
    const user= await User.findOne({
        phone_number: phoneNumber,
    });
    if(!user){
        throw new ApiError(404, "User not found");
    }

  const token = user.generateAuthToken();
    res.
    cookie("accessToken", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure:true
    }).
    status(200).json({
        success: true,
        message: "User logged in successfully",
        accessToken:token});
});

module.exports={registerUser,loginUser}
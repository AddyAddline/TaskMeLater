const express = require("express");
const {UserPriority} = require("../utils/enums");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

const registerUser= asyncHandler(async (req, res) => {
    const {phoneNumber, priority}=req.body;

    //validate 
    if (!phoneNumber || !priority) {
        return res.status(400).json({
            success: false,
            message: "Phone number and priority are required",
        });
    }
    if(phoneNumber.length!==10){
        return res.status(400).json({
            success: false,
            message: "Phone number must be 10 digits",
        });
    }
    if(!Object.values(UserPriority).includes(priority)){
        return res.status(400).json({
            success: false,
            message: "Priority must be 0, 1, or 2(not a string)",
        });
    }
    //check if user already exists
    const user= await User.findOne({
        phone_number: phoneNumber,
    });
    if(user){
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
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
        return res.status(400).json({
            success: false,
            message: "Phone number is required",
        });
    }
    if(phoneNumber.length!==10){
        return res.status(400).json({
            success: false,
            message: "Phone number must be 10 digits",
        });
    }
    //check if user exists
    const user= await User.findOne({
        phone_number: phoneNumber,
    });
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User does not exist",
        });
    }

  const token = user.generateAuthToken();
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token});
});

module.exports={registerUser,loginUser}
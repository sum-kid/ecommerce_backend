const jwt=require('jsonwebtoken');
const env=require('dotenv');
const userModel = require('../models/userModel');
env.config();

module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
        if(req.cookies.login){
            let isVerified=jwt.verify(req.cookies.login,process.env.JWT_SECRET_KEY);
            if(isVerified){
                req.id=isVerified.payload;
                //we are attaching userid to the req
                //console.log(req.id);
                next();
            }
            else{
                return res.json({
                    message:"User not verified"
                });
            }
        }
        else{
            return res.json({
                message:"Plese login again"
            });
        }
    }
    catch(err){
        return res.json({
            message:err.message
        });
    }
}

module.exports.isAuthorised=async function isAuthorised(req,res,next){
    try{
        const user=await userModel.findById(req.id);
        if(user){
            if(user.role=='admin'){
                next();
            }
            else{
                return res.json({
                    message:"Unauthorised access"
                });
            }
        }
        else{
            return res.json({
                message:"Please login again"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.isAuthorisedAdmin=async function isAuthorisedAdmin(req,res,next){
    try{
        const user=await userModel.findById(req.id);
        if(user){
            if(user.role=='admin'){
                next();
            }
            else{
                return res.json({
                    message:"Unauthorised access"
                });
            }
        }
        else{
            return res.json({
                message:"Please login again"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.isAuthorisedUser=async function isAuthorisedUser(req,res,next){
    try{
        const user=await userModel.findById(req.id);
        if(user){
            if(user.role=='user'){
                next();
            }
            else{
                return res.json({
                    message:"Unauthorised access"
                });
            }
        }
        else{
            return res.json({
                message:"Please login again"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}


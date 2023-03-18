const userModel=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

module.exports.signup=async function signup(req,res){
    try{
        let dataObj=req.body;
        let attributes=[];
        for(let data in dataObj){
            attributes.push(data);
        }
        let user=new userModel();
        for(let i=0;i<attributes.length;i++){
            user[attributes[i]]=dataObj[attributes[i]];
        }
        let userType=req.params.role;
        if(userType=='admin'){
            user.role='admin';
        }
        await user.save();
        if(user){
            //now user is directly directed to home or some other page..No need to login again
            let uid=user._id;
            let token=jwt.sign({payload:uid},process.env.JWT_SECRET_KEY);
            res.cookie('login',token,{httpOnly:true});
            return res.json({
                message:"Signed up successfully.",
                data:user,
                cookie:token
            });
        }
        else{
            return res.json({
                message:"Error while signing-up!!Please sign-up again."
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.signin=async function signin(req,res){
    try{
       // res.cookie('login','',{maxAge:1});
        let {email,password}=req.body;
        let user=await userModel.findOne({email:email});
        if(user){
            const isMatch=await bcrypt.compare(password,user.password);
            if(isMatch){
                let uid=user._id;
                let token=req.cookies.login;
                if(!req.cookies.login){
                    token=jwt.sign({payload:uid},process.env.JWT_SECRET_KEY);
                    res.cookie('login',token,{httpOnly:true});
                }
                return res.json({
                    message:"Signed in successfully",
                    data:user,
                    cookie:token
                })
            }
            else{
                return res.json({
                    message:"Please enter correct password"
                });
            }
        }
        else{
            return res.status(404).json({
                message:"Please enter correct email or sign-up required"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.signout=function signout(req,res){
    try{
        res.cookie('login','',{maxAge:1});
        res.json({
            message:"User signed-out successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
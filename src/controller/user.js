const userModel=require('../models/userModel');

module.exports.getProfile=async function getProfile(req,res){
    try{
        const id=req.id;
        let user=await userModel.findById(id);
        if(user){
            return res.json({
                message:"User profile retrieved",
                data:user
            });
        }
        else{
            return res.json({
                message:"Login required"
            });
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

module.exports.updateUser=async function updateUser(req,res){
    try{
        let id=req.params.id;
        let user=await userModel.findById(id);
        let dataToBeUpdated=req.body;
        if(user){
            const keys=[];
            for(let key in dataToBeUpdated){
                keys.push(key);
            }
            for(let i=0;i<keys.length;i++){
                user[keys[i]]=dataToBeUpdated[keys[i]];
            }
           await user.save();
            res.json({
                message:"data updated successfully",
                data:user
            });
        }
        else{
            res.json({
                message:"user not found"
            });
        }
    }
    catch(err){
        res.json({
            message:err.message
        });
    }

}

module.exports.deleteUser=async function deleteUser(req,res){
    try{
        let id=req.params.id;
        let user=await userModel.findByIdAndDelete(id);
        if(!user){
            res.json({
                message:"User not found"
            });
        }
        else{
            res.json({
                message:"data deleted successfully",
                data:user
            });
        }
    }
    catch(err){
        res.json({
            message:err.message
        });
    }
}
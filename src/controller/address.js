const addressModel = require("../models/addressModel");

module.exports.addAddress=async function addAddress(req,res){
    try{
        let dataObj=req.body.address;
        let address=await addressModel.findOne({user:req.id});
        if(address){
            await addressModel.findOneAndUpdate({user:req.id},{
                "$push":{
                    "address":dataObj
                }
            },{runValidators:true});
        }
        else{
            address=new addressModel();
            address.user=req.id;
            address.address=dataObj;
            await address.save();
        }
        return res.json({
            message:"Address added successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.getAllAddress=async function getAllAddress(req,res){
    try{
        const address=await addressModel.find({user:req.id},{address:1});
        if(address){
            return res.json({
                data:address
            });
        }
        else{
            return res.stauts(200).json({
                message:"No address found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.getParticularAddress=async function getParticularAddress(req,res){
    try{
        let addr=await addressModel.findOne({user:req.id,"address._id":req.params.id}).select({
            address:{$elemMatch:{_id:req.params.id}}
        });
        if(addr){
            return res.json({
                message:addr
            })
        }
        else{
            return res.status(200).json({
                message:"Address not found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.updateAddress=async function updateAddress(req,res){
    try{
        let dataObj=req.body;
        let user =await addressModel.findOne({user:req.id,"address._id":req.params.id});
        if(!user){
            return res.status(200).json({
                message:"Address not found"
            });
        }
        let attributes=[];
        for(let data in dataObj){
            attributes.push(data);
        }
        //getting the address and removing it and then adding it again after modifications
        let addr=await addressModel.findOne({user:req.id,"address._id":req.params.id}).select({
            address:{$elemMatch:{_id:req.params.id}}
        });
        addr=addr.address;
        addr=addr[0];
        addr._id=undefined;
        for(let i=0;i<attributes.length;i++){
            addr[attributes[i]]=dataObj[attributes[i]];
        }
        await addressModel.findOneAndUpdate({user:req.id},{
            "$push":{
                "address":addr
            }
        },{runValidators:true});
        await addressModel.findOneAndUpdate({user:req.id,"address._id":req.params.id},{
            $pull:{address:{_id:req.params.id}}
        });
        return res.json({
            message:"Address updated successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
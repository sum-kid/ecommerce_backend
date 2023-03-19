const slugify = require("slugify");
const multer=require('multer');
const shortid=require('shortid');
const productModel = require("../models/productModel");

module.exports.addProduct=async function addProduct(req,res){
    try{
        let dataObj=req.body;
        let attributes=[];
        for(let data in dataObj){
            attributes.push(data);
        }
        let product=new productModel();
        for(let i=0;i<attributes.length;i++){
            product[attributes[i]]=dataObj[attributes[i]];
        }
        product.slug=slugify(dataObj.name);
        product.createdBy=req.id;
        let productPicture=[];
        if (req.files.length > 0) {
            productPicture = req.files.map((file) => {
              return { img: file.filename };
            });
        }
        product.productPicture=productPicture;
        await product.save();
        if(product){
            return res.json({
                message:"Product added",
                data:product,
                img:req.files
            });
        }
        else{
            return res.json({
                message:"Please try again"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }    
}

module.exports.getAllProduct=async function getAllProduct(req,res){
    try{
        let product=await productModel.find({createdBy:req.id});
        if(product){
            return res.json({
                message:"All Products retrieved",
                data:product
            });
        }
        else{
            return res.status(400).json({
                message:"No product found"
            });
        }
    }
    catch(err){
        return res.status(400).json({
            message:err.message
        });
    }
}

module.exports.updateProduct=async function updateProduct(req,res){
    try{
        let productId=req.params.id;
        let product=await productModel.findById({_id:productId});
        let dataObj=req.body;
        if(product){
            let attr=[];
            for(let data in dataObj){
                attr.push(data);
            }
            for(let i=0;i<attr.length;i++){
                if(attr[i]=='productPicture'){
                    continue;
                }
                product[attr[i]]=dataObj[attr[i]];
            }
            let productPicture=[];
            if (req.files.length > 0) {
                productPicture = req.files.map((file) => {
                return { img: file.filename };
                });
            }
            product.productPicture=productPicture;
            await product.save();
            return res.json({
                message:"data updated successfully"
            });
        }
        else{
            return res.status(400).json({
                message:"Product not found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.deleteProduct=async function deleteProduct(req,res){
    try{
        let prod=await productModel.findOne({_id:req.params.id,'createdBy':req.id})
        if(prod){
            await productModel.deleteOne({_id:req.params.id,'createdBy':req.id});
            return res.json({
                message:"Product deleted successfully"
            });
        }
        else{
            return res.status(400).json({
                message:"Product not found"
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
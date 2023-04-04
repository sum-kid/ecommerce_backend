const slugify = require("slugify");
const multer=require('multer');
const shortid=require('shortid');
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

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
        product.createdBy=req.id;
        //this will help in adding same product by diff user
        product.userProduct=product.name+product.createdBy.toString();
        product.slug=slugify(product.userProduct);
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

module.exports.getAllProductAdmin=async function getAllProductAdmin(req,res){
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

module.exports.getAllProduct=async function getAllProduct(req,res){
    try{
        let product=await productModel.find();
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
        return res.status(500).json({
            message:err.message
        });
    }   
}

module.exports.getProduct=async function getProduct(req,res){
    try{
        let prod=await productModel.findOne({_id:req.params.id});
        if(prod){
            return res.json({
                data:prod
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

module.exports.updateProduct=async function updateProduct(req,res){
    try{
        let productId=req.params.id;
        let product=await productModel.findById({_id:productId});
        let dataObj=req.body;
        if(product){
            let flag=false;
            let attr=[];
            for(let data in dataObj){
                attr.push(data);
            }
            for(let i=0;i<attr.length;i++){
                if(attr[i]=='productPicture'){
                    flag=true;
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
            if(flag){
                product.productPicture=productPicture;
            }
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
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.getProductBySlug=async function getProductBySlug(req,res){
    try{
        const catId=await categoryModel.findOne({slug:req.params.slug},{_id:1});
        if(catId){
            const products=await productModel.find({category:catId});
            if(products){
                const prodUnder40k=products.filter((product)=> product.price<=40000);
                const prodUnder60k=products.filter((product)=> product.price>40000 && product.price<=60000);
                const prodUnder80k=products.filter((product)=> product.price>60000 && product.price<=80000);
                return res.json({
                under40k:prodUnder40k,
                under60k:prodUnder60k,
                under80k:prodUnder80k,
                data:products
                });
            }
            else{
                return res.status(400).json({
                    message:"No product found for this category"
                });
            }
        }
        else{
            return res.status(400).json({
                message:"Category not found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
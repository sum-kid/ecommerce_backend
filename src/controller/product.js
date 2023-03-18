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
//create update product where admin can update product details
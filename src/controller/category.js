const slugify= require('slugify');
const categoryModel = require('../models/categoryModel');

// this will help in getting category list in organised manner
function treeRelationshipCategory(categories,parentId=null){
    let categoryList=[];
    let category;
    if(parentId==null){
        category=categories.filter(function(cat){
        return cat.parentId==undefined;
        });
    }
    else{
        category=categories.filter(function(cat){
        return cat.parentId==parentId;
    });
    }
    for(let cate of category ){
        categoryList.push({
        _id: cate._id,
        name: cate.name,
        slug: cate.slug,
        parentId: cate.parentId,
        type: cate.type,
        children: treeRelationshipCategory(categories, cate._id),
        });
    }
    return categoryList;
}
module.exports.addCategory=async function addCategory(req,res){
    try{
        let dataObj=req.body;
        let category=new categoryModel();
        category.name=dataObj.name;
        category.slug=slugify(dataObj.name);
        if(dataObj.parentId){
            category.parentId=req.body.parentId;
        }
        let categoryImage=[];
        if (req.files.length > 0) {
            categoryImage = req.files.map((file) => {
              return { img: file.filename };
            });
        }
       // console.log(categoryImage);
        category.categoryImage=categoryImage;
        await category.save();
        return res.json({
            message:"Category added",
            data:category
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.getAllCategories=async function getAllCategories(req,res){
    try{
        let categories=await categoryModel.find();
        if(categories){
            return res.json({
                message:"Categories retrieved successfully",
                data:treeRelationshipCategory(categories)
            });
        }
        else{
            return res.status(404).json({
                message:"No data found"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.updateCategory=async function updateCategory(req,res){
    try{
        let cat=await categoryModel.findOne({_id:req.params.id});
        let dataObj=req.body;
        if(cat){
            let flag=false;
            let attr=[];
            for(let data in dataObj){
                attr.push(data);
            }
            for(let i=0;i<attr.length;i++){
                if(attr[i]=='categoryImage'){
                    flag=true
                    continue;
                }
                cat[attr[i]]=dataObj[attr[i]];
            }
            if(flag){
                let catImage=[];
                if(req.files.length>0){
                    catImage=req.files.map((file) => {
                        return {img:file.filename};
                    });
                }
                cat.categoryImage=catImage;
            }
            await cat.save();
            return res.json({
                message:"data updated successfully"
            });
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

module.exports.deleteCategory=async function deleteCategory(req,res){
    try{
        let cat=await categoryModel.findOne({_id:req.params.id});
        if(cat){
            await categoryModel.deleteOne({_id:req.params.id});
            return res.json({
                message:"Category deleted successfully"
            });
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
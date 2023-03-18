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
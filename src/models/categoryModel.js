const mongoose=require('mongoose');

mongoose.set('strictQuery',true);

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    type:String,
    categoryImage:[
        //array of img
          { img: { type: String } }
      ],
    parentId:String
},{timestamps:true});

const categoryModel=mongoose.model('categoryModel',categorySchema);

module.exports=categoryModel;
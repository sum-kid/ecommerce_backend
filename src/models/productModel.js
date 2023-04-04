const mongoose=require("mongoose");

mongoose.set('strictQuery',true);

const productSchema=new mongoose.Schema({
  name:{
          type: String,
          required: true,
          trim: true
      },
      slug:{
          type: String,
          required: true
      },
      price:{
          type: Number,
          required: true
      },
      quantity:{
          type: Number,
          default:1
      },
      description: {
          type: String,
          required: true,
          trim: true
      },
      offer:Number,
      productPicture: [
        //array of img
          { img: { type: String } }
      ],
      reviews: [
          {
              userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
              review: String
          }
      ],
      category: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Category', 
         required: true 
        },
      createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
      updatedAt: {
        type:Date,
        default:Date.now()
    },
      userProduct:{
        type:String,
        unique:true
      }
},{timestamps: true});


const productModel=mongoose.model('productModel',productSchema);

module.exports=productModel;

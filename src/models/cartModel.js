const mongoose=require('mongoose');

mongoose.set('strictQuery',true);

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    cartItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number}
        }
    ],
    price:Number
},{timestamps:true});

const cartModel=mongoose.model('cartModel',cartSchema);

module.exports=cartModel;
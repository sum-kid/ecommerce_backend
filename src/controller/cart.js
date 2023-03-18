const cartModel=require('../models/cartModel');
const productModel = require('../models/productModel');

//currently it allows to add those product also which doesn't exost as we r not validating produtid
module.exports.addToCart=async function addToCart(req,res){
    try{
        //checking if the product is valid or not
        let dataObj=req.body.cartItems;
        for(let i=0;i<dataObj.length;i++){
            let prod=await productModel.findOne({_id:dataObj[i].product});
                if(!prod){
                    return res.status(400).json({
                        message:"Product not found"
                    })
                }
        }
        let cart;
        cart=await cartModel.findOne({user:req.id});
        if(cart){
            //if cart already exists forthe user then we update the cart
            for(let i=0;i<dataObj.length;i++){
                let prod=await productModel.findOne({_id:dataObj[i].product});
                let updatedData=await cartModel.findOneAndUpdate({user:req.id,"cartItems.product":dataObj[i].product},
                            {"$inc":{"cartItems.$.price":prod.price,"cartItems.$.quantity":dataObj[i].quantity},"price":prod.price*dataObj[i].quantity},false,true);
                if(!updatedData){
                    await cartModel.findOneAndUpdate({user:req.id},{"$inc":{"price":prod.price*dataObj[i].quantity}})
                    await cartModel.findOneAndUpdate({user:req.id},{
                        //we are pushing into the array of cartItems
                        "$push":{
                            "cartItems":{"product":dataObj[i].product,'price':prod.price,'quantity':dataObj[i].quantity}
                        }
                    });
                }
            }
        }
        else{
            cart=new cartModel();
            cart.user=req.id;
            let cost=0;
            for(let i=0;i<dataObj.length;i++){
                const prod=await productModel.findOne({_id:dataObj[i].product});
                dataObj[i].price=prod.price;
                cost+=prod.price*dataObj[i].quantity;
            }
            cart.cartItems=dataObj;
            cart.price=cost;
            await cart.save();
            return res.json({
                message:"Item added to cart successfully",
                data:cart
            });
        }
        return res.json({
            message:"Item added to cart successfully",
            data:cart
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
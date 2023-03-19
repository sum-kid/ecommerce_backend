const express=require('express');
const { addToCart, deleteFromCart, getAllCartItems } = require('../controller/cart');
const { protectRoute, isAuthorisedUser } = require('../middleware/authHelper');
const cartRouter=express.Router();

cartRouter.use(protectRoute);
cartRouter.use(isAuthorisedUser);
cartRouter.route('/addToCart')
    .post(addToCart);

cartRouter.route('/deleteFromCart')
    .patch(deleteFromCart);

cartRouter.route('/getAllCartItems')
    .get(getAllCartItems);

module.exports=cartRouter;
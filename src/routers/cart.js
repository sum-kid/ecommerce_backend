const express=require('express');
const { addToCart } = require('../controller/cart');
const { protectRoute, isAuthorisedUser } = require('../middleware/authHelper');
const cartRouter=express.Router();

cartRouter.use(protectRoute);
cartRouter.use(isAuthorisedUser);
cartRouter.route('/addToCart')
    .post(addToCart);

module.exports=cartRouter;
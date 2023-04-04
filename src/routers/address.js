const express=require('express');
const addressRouter=express.Router();
const { addAddress, getAllAddress, getParticularAddress, updateAddress } = require("../controller/address");
const { protectRoute, isAuthorisedUser } = require("../middleware/authHelper");


addressRouter.use(protectRoute);
addressRouter.use(isAuthorisedUser);
addressRouter.route('/add')
    .post(addAddress);

addressRouter.route('/getAll')
    .get(getAllAddress);

addressRouter.route('/get/:id')
    .get(getParticularAddress);

addressRouter.route('/updateAddress/:id')
    .patch(updateAddress);

module.exports=addressRouter;
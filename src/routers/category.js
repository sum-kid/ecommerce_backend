const express=require('express');
const { addCategory, getAllCategories } = require('../controller/category');
const {protectRoute,isAuthorisedAdmin}=require('../middleware/authHelper');
const categoryRouter=express.Router();

categoryRouter.route('/getAllCategory')
    .get(getAllCategories);

categoryRouter.use(protectRoute);
categoryRouter.use(isAuthorisedAdmin);
categoryRouter.route('/create')
    .post(addCategory);

module.exports=categoryRouter;


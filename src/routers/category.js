const express=require('express');
const { addCategory, getAllCategories, updateCategory, deleteCategory } = require('../controller/category');
const {protectRoute,isAuthorisedAdmin}=require('../middleware/authHelper');
const categoryRouter=express.Router();
const multer=require('multer');
const path=require('path');
const shortid=require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //__dirname gets back to parent directory i.e. routes in thus cse and then dirname gives that oarent dir i.e routes which is then joined with uploads in it
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate()+"-"+file.originalname)
    }
});

const upload=multer({storage}); 

categoryRouter.route('/getAllCategory')
    .get(getAllCategories);

categoryRouter.use(protectRoute);
categoryRouter.use(isAuthorisedAdmin);
categoryRouter.route('/create')
    .post(upload.array('categoryImage'),addCategory);

categoryRouter.route('/updateCategory/:id')
    .patch(upload.array('categoryImage'),updateCategory);

categoryRouter.route('/deleteCategory/:id')
    .delete(deleteCategory);

module.exports=categoryRouter;


const express=require('express');
const { addProduct, updateProduct, deleteProduct, getAllProduct, getProduct, getProductBySlug, getAllProductAdmin } = require('../controller/product');
const { protectRoute, isAuthorised } = require('../middleware/authHelper');
const productRouter=express.Router();
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

productRouter.route('/:slug')
    .get(getProductBySlug);

productRouter.route('/getProduct/:id')
    .get(getProduct);

productRouter.route('/getAllProduct')
    .get(getAllProduct);

productRouter.use(protectRoute);
productRouter.use(isAuthorised);
productRouter.route('/addProduct')    // req.file is the `file name that we give` file
    .post(upload.array('productPicture'),addProduct);

productRouter.route('/updateProduct/:id')
    .patch(upload.array('productPicture'),updateProduct);

productRouter.route('/deleteProduct/:id')
    .delete(deleteProduct);

productRouter.route('/getAllProductAdmin')
    .get(getAllProductAdmin);

module.exports=productRouter;
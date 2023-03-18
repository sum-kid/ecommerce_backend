const express=require('express');
const { addProduct } = require('../controller/product');
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

productRouter.use(protectRoute);
productRouter.use(isAuthorised);
productRouter.route('/addProduct')    // req.file is the `file name that we give` file
    .post(upload.array('productPicture'),addProduct);

module.exports=productRouter;
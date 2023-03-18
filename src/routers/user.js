const express=require('express');
const { protectRoute } = require('../middleware/authHelper');
const userRouter=express.Router();
const {signup, signin, signout}=require('../controller/auth');
const { getProfile } = require('../controller/user');

//admin signup
userRouter.route('/:role/signup')
    .post(signup);

userRouter.route('/signup')
    .post(signup)

userRouter.route('/signin')
    .post(signin);

userRouter.use(protectRoute);
userRouter.route('/profile')
    .get(getProfile);

userRouter.route('/signout')
    .get(signout);

module.exports=userRouter;
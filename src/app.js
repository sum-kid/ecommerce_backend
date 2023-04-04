const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const env=require('dotenv');
env.config();

const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const server=async ()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`Server is running on PORT ${PORT}`);
        });
    }
    catch(err){
        console.log(err);
    }
}

server();

mongoose.connect(process.env.db_link)
    .then(function(){
        console.log('Connected to Ecommerce database');
    })
    .catch(function(err){
        console.log(err);
    });

const userRouter=require('./routers/user');
const categoryRouter=require('./routers/category');
const productRouter=require('./routers/product');
const cartRouter=require('./routers/cart');
const addressRouter = require('./routers/address');

app.use('/user',userRouter);
app.use('/category',categoryRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/address',addressRouter);



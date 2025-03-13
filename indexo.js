const cors=require('cors');
const express=require('express');
const morgan=require('morgan');
const { prodsRouter,PaymentRoute } = require('./Controllers/controller');
const {orderRouter}=require('./Controllers/controlOrderMethods')
const {UserRoutes}=require('./Controllers/userController')
//create an instance of the express which returns app object with many methods that provides many functionalities
const app=express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));




app.use('/products/v1',prodsRouter);
app.use('/payment/v5',PaymentRoute);
app.use('/orders/v1',orderRouter);
app.use('/users/v3',UserRoutes);




module.exports=app;
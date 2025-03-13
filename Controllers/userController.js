const app=require('../indexo');
const express=require('express');
const {Users}=require('../Models/usersModel');
const {SignUp,Login,forgotPassword,resetpassword}=require('./authContoller');
//const axios = require('axios');

const getUsers= async (req,res)=>{
    try{
        const users=await Users.find();
        res.status(200).json({
            status:'success',
            data:users
     })
       }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
           })
       }
    
    };
    
    const postUser= async (req,res)=>{
        try{ 
            const posted=await Users.create(req.body) ;
            res.status(200).json({
                status:'success',
                data:posted
         })
    
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
           })
    }
    
    };
    const getSingleUser= async (req,res)=>{
        try{
            const user=await Users.findById(req.params.id);
            // const itemID = req.params.id;
            // const user=await Users.findOne({ OrderId: itemID })
            res.status(200).json({
                status:'success',
                message:user
               })
    
        }catch(err){
            res.status(404).json({
                status:'fail',
                message:err
               })
        }
        
    };
    const updateUser= async (req,res)=>{
        try{
            
            const updated=await Users.findByIdAndUpdate(req.params.id,req.body,{
                runValidators:true,
                new:true
             } )
             res.status(200).json({
                status:'success',
                message:updated
               })
    
    
        }catch(err){
            res.status(404).json({
                status:'fail',
                message:err
               })
        }
            
        
        
    };
    const deleteUser= async (req,res)=>{
        try{
            const deletedUser=await Users.deleteOne();
            res.status(204).json({
                status:'succes',
                data:null
           });
            
    
        }catch(err){
            res.status(404).json({
                status:'fail',
                message:err
               }) 
            
        }
         
    }

    const UserRoutes=express.Router();
    UserRoutes.post('/sign',SignUp);
    UserRoutes.post('/login',Login);
    UserRoutes.post('/forgotpassword',forgotPassword);
    UserRoutes.patch('/resetPassword/:token',resetpassword);

    UserRoutes.route('/')
    .get(getUsers)
    .post(postUser);
    UserRoutes.route('/:id')
    .get(getSingleUser)
    .patch(updateUser)
    .delete(deleteUser);

    module.exports={UserRoutes};
const app=require('../indexo');
const express=require('express');
const {Orders}=require('../Models/model');
const axios = require('axios');

const getOrderss= async (req,res)=>{
    try{
        const prods=await Orders.find();
        res.status(200).json({
            status:'success',
            data:prods
     })
       }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
           })
       }
    
    };
    
    const postOrder= async (req,res)=>{
        try{ 
            const posted=await Orders.create(req.body) ;
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
    const getSingleOrder= async (req,res)=>{
        try{
            //const elem=await Orders.findById(req.params.id);
            const itemID = req.params.id;
            const elem=await Orders.findOne({ OrderId: itemID })
            res.status(200).json({
                status:'success',
                message:elem
               })
    
        }catch(err){
            res.status(404).json({
                status:'fail',
                message:err
               })
        }
        
    };
    const updateOrder= async (req,res)=>{
        try{
            
            const updated=await Orders.findByIdAndUpdate(req.params.id,req.body,{
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
                message:err.message
               })
        }
            
        
        
    };
    const deleteOrder= async (req,res)=>{
        try{
            const deleted=await Orders.deleteOne({_id:req.params.id});
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

    const orderRouter=express.Router();
    orderRouter.route('/')
    .get(getOrderss)
    .post(postOrder);
    orderRouter.route('/:id')
    .get(getSingleOrder)
    .patch(updateOrder)
    .delete(deleteOrder);

    module.exports={orderRouter};
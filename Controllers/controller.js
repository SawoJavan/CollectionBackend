const app=require('../indexo');
const express=require('express');
const {Products}=require('../Models/model');
const axios = require('axios');
//Products
const getProds= async (req,res)=>{
try{
    const prods=await Products.find();
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

const postProds= async (req,res)=>{
    try{ 
        const posted=await Products.create(req.body) ;
        res.status(200).json({
            status:'success',
            data:'posted successfully'
     })

}catch(err){
    res.status(404).json({
        status:'fail',
        message:err
       })
}

};
const getSingleProd= async (req,res)=>{
    try{
        const elem=await Products.findById(req.params.id);
        //const ele=await Products.findOne()
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
const updateProd= async (req,res)=>{
    try{
        
        const updated=await Products.findByIdAndUpdate(req.params.id,req.body,{
            runValidators:true,
            new:true
         } )
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
const deleteProd= async (req,res)=>{
    try{
        const deleted=await Products.deleteOne({_id:req.params.id});
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


//payment controller
let accessToken;
  const PaymentMidleware=async (req,res,next)=>{
    const consumer=process.env.CONSUMER_KEY;
    const secret=process.env.CONSUMER_SECRET;
    const auth=new Buffer.from(`${consumer}:${secret}`).toString("base64");
    try{

    
   const response= await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers:{
         authorization:`Basic ${auth}`
      }
    }
    )
    accessToken=response.data.access_token;
    console.log('Access Token:', accessToken);
    req.accessToken = accessToken;
    
   
    next();
    
    }catch(err)
    {
       res.status(404).json(err.message);
    }
}

const createPayment=async(req,res)=>{
   const accessToken = req.accessToken;
   res.status(200).json({
      status: 'success',
      message: 'Payment collection token accessed successfully',
      accessToken: accessToken, // Sending back the accessToken in the response for testing purposes
    });

}
const stkPush=async(req,res)=>{
const shortcode="174379";
const amount=req.body.amount;
const phone=req.body.phone;
if (!amount || !phone) {
   return res.status(400).json({
     status: "fail",
     message: "Amount and phone are required fields."
   });
 }

 // Check if phone starts with a zero and remove it
 const formattedPhone = phone.startsWith('0') ? phone.substring(1) : phone;

const passkey='bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const url='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const date=new Date();
const timestamp=date.getFullYear()+ 
("0" + (date.getMonth + 1)).slice(-2)+
("0" + (date.getDate )).slice(-2)+
("0" + (date.getHours)).slice(-2)+
("0" + (date.getMinutes)).slice(-2)+
("0" + (date.getSeconds)).slice(-2);
const password=new Buffer.from(shortcode + passkey + timestamp).toString('base64');

const rekBody={    
   "BusinessShortCode": shortcode,    
   "Password": password,    
   "Timestamp":timestamp,    
   "TransactionType": "CustomerPayBillOnline",    
   "Amount": amount,    
   "PartyA":`254${formattedPhone}`,    
   "PartyB":shortcode,    
   "PhoneNumber":`254${formattedPhone}`,    
   "CallBackURL": "https://mydomain.com/pat",    
   "AccountReference":"JavooCollection",    
   "TransactionDesc":"JavoTest"
} 

try{
   const respo=await axios.post(url,rekBody,{
      headers:{
         authorization:`Bearer ${accessToken}`
      }
  });
//   res.status(200).json({
//     status:'sucess',
//     message:'Payment made succesfully'
//   });
// Check if the request was successful and send the response from M-Pesa API
if (respo.data.ResponseCode === "0") {
    res.status(200).json({
        status: 'success',
        message: 'Payment made successfully',
        response: respo.data
    });
} else {
    res.status(500).json({
        status: 'fail',
        message: 'Payment failed',
        response: respo.data
    });
}

}catch(err){
   console.log(err.message)
   res.status(500).json({
      status:'fail',
      message:err.message
    });
}
 

}



  const PaymentRoute=express.Router();
  
 //routes

 PaymentRoute.use('/',PaymentMidleware);






const prodsRouter=express.Router();
prodsRouter.route('/')
.get(getProds)
.post(postProds)

prodsRouter.route('/:id')
.get(getSingleProd)
.delete(deleteProd)
.patch(updateProd);

 //Payment route
 PaymentRoute.route('/')
 .get(createPayment)
 .post(stkPush);

module.exports={prodsRouter,PaymentRoute};
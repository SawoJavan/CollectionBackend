const mongoose=require('mongoose');
const prodsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'must have name'],
    },
    gender:{
        type:String
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    image:{
        type:String
    },
    size:{
        type:String
    }
    

});
const Products=mongoose.model('Products',prodsSchema);

const itemSchema = new mongoose.Schema({
    quantity: { type: Number,  },
    name: { type: String,  },
    size: { type: String },
    price: { type: Number,  },
    image:{type:String},
    id:{type:String}
});

const ordersSchema = new mongoose.Schema({
     CustomerDetails:{
        type:{
            Name: {type:String},
            Phone:{type:Number},
            Adress:{type:String}
        },
        
     },
     Items:{
        type:[itemSchema]
     },
     amountPaid:{
        type:Number
     },
     deliverStatus:{
        type:String,
        default:'Being processed'
     },
     OrderId:{
        type:Number
     },
     
});
const Orders=mongoose.model('Orders',ordersSchema);

module.exports={Products,Orders};
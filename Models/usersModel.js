const crypto=require("crypto");
const mongoose=require('mongoose');
const validator=require(   'validator');
const bcrypt=require('bcryptjs');
const usersSchema= new mongoose.Schema({
    Username:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Provide your email'],
        validate:[validator.isEmail,'Provide a valid email'],
        unique:true


    },
    photo:{
       type:String
    },
    password:{
        type:String,
        required:[true,'Provide your password'],
        minlength:8,
        select:false,
        passwordChangedAt:Date,
        passwordResetToken: String,
        passwordResetExpire: Date 
    },

    confirmPassword:{
        type:String,
        required:[true,'Confirm your password'],
       //runs on onSave or create.
        validate: {
            validator:function (el){return el===this.password} ,
            message:'Passwords are not the same'
        }
    }


});
//Runs when data has been recieved from the burl and bieng taken to the database
usersSchema.pre('save',async function(next){
     if(!this.isModified('password') )return next();

     this.password=await bcrypt.hash(this.password,12);
     this.confirmPassword=undefined;
     next();
});
usersSchema.methods.correctPassword= async function(candidate,userPassword){
    return await bcrypt.compare(candidate, userPassword);
}
//create passwordResetToken
usersSchema.methods.generateRandomToken= async()=>{

 resetToken=   crypto.randomBytes(32).toString('hex');
 const storeHashedToken=await crypto.createHash( 'sha256').update(resetToken).digest('hex');
//  console.log(resetToken);
//  console.log(storeHashedToken);
 this.passwordResetToken=storeHashedToken;
 this.passwordResetExpire=Date.now()+ 10*60*1000;

 return resetToken;
}
const Users=mongoose.model('Users',usersSchema);

module.exports={Users}; 
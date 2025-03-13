const {Users}=require('../Models/usersModel');
const sendEmail=require('./email');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');

//signing up users
 const SignUp=async(req,res,next)=>{
    try{
        const signedUser=await Users.create(
            {
                Username:req.body.Username,
                email:req.body.email,
                password:req.body.password,
                confirmPassword:req.body.confirmPassword
            }
        );
        res.status(200).json({
          status:'success',
          data:signedUser
        })
    

    }catch(err){
    res.status(404).json({
      status:'fail',
       data:err.message
    });
    }
    next();
  };
  

  const Login= async(req,res,next)=>{
       try{
        const {email,Password}=req.body;

        //Check if password and email exist
          if(!email || !Password){
          throw new Error('Please provide email and Password'); 
            
          }
        //Check if the user is database and the password are matching
        const user= await Users.findOne({email}).select('+password');
        console.log(user);
        if (!user || !(await user.correctPassword(Password, user.password))) {
            throw new Error('Incorrect email or password');
        }

        //assign a web token to the user and log in the user
        const token=jwt.sign({ id: user._id }, 'secret-key-is-very-important-now', {
            expiresIn: '1h'});
        res.status(200).json({
            status:'success',
            token,
            data:{email:user.email,name:user.Username}
          });
          next();
      
       }catch(err){
        res.status(404).json({
            staus:'fail',
             message:err.message
          });
       }
  }
//Forgot password reset function
  const forgotPassword=async(req,res)=>{
    try{
      //find the user based on the email provided
      const user=await Users.findOne({email:req.body.email});
      if(!user){
         throw new Error('User with the email provided does not exist');
      };
      //Generate a random token 
        const  resetToken = await user.generateRandomToken();
        console.log(resetToken);
        //save the token to the users document
        await user.save({validateBeforeSave:false});
        //send an email to the user with nodemailer
         resetUrl= `${req.protocol}://${req.get('host')}/users/v3/resetPassword/${resetToken}`;
        const message= `Dear ${user.Username},\n\nYou requested to reset your password.\n\nPlease 
        use the following link to reset your password ${resetUrl}`;
      try{
        await sendEmail({
          email:user.email,
          message,
          subject:'Your password reset token (valid for 10 mins)'
      })
   res.status(200).json({
        status:"sucess",
        message:"A reset token has been sent to your email"
      });

      }catch(err){
         user.passwordResetToken=undefined;
         user.passwordResetExpire=undefined;
         await user.save({validateBeforeSave:false});
         throw err;
      }
       
    }catch(err){
      res.status(500).json({
        staus:'fail',
         message:err
      });
    }
  }
  const resetpassword= async (req,res)=>{
    try{
        //1 Find the user based on the resetToken and check if the time has expired 
        const {token}= req.params;
        console.log(token);
        const  resetToken=crypto.createHash( 'sha256').update(token).digest("hex");
        const user=await Users.findOne({passwordResetToken:resetToken , passwordResetExpire:{$gt:Date.now()}})
         if( !user ){
              throw new Error('Password reset token is invalid or has expired');
         }

        //2 Update  the new Password if it is valid then save
        user.password=req.body.password;
        user.confirmPassword=req.body.confirmPassword;
        user.passwordResetToken= undefined;
        user.passwordResetExpire = undefined ;
        await user.save();
        // const webtoken=jwt.sign({ id: user._id }, 'secret-key-is-very-important-now', {
        //   expiresIn: '1h'});
        res.status(200).json({
            status:'success',
            message :'Password has been changed successfully .Please log in with your new password.', 
            

             
             })
    }catch(err){
      res.status(404).json({
        staus:'failed',
         message:err
      });
    }
        
};
  module.exports={SignUp,Login,forgotPassword,resetpassword};
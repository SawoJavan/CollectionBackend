const nodemailer=require('nodemailer');
const sendEmail=async(options)=>{
    // console.log(process.env.PORT);
    // console.log(process.env.EMAIL_USERNAME);
    // console.log(process.env.USER_PASSWORD);
    // console.log(process.env.HOST_TRANSPOTER)
    // console.log('OYAAAAAAAAA')
    //create a transporter
    const transporter=nodemailer.createTransport({
        host:process.env.HOST_TRANSPOTER,
        port:process.env.PORT,

    //   service:'Gmail',
      auth: {
          user: process.env.EMAIL_USERNAME ,
          pass: process.env.USER_PASSWORD // generated
      }

    });
    //specify mail options
    const mailOptions={
        from:`elianmars13@gmail.com`,
            to:`${options.email}`,
            subject:`${options.subject}`,
            text:`${options.message}`
            };
    //send email
    await transporter.sendMail(mailOptions);
    //   try{
    //     await transporter.sendMail(mailOptions);
    //     console.log( 'Email sent: ');

    //   }catch(err){
    //      console.log(err);
    //      throw err;
    //   }
       


     
}
module.exports=sendEmail;
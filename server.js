const app=require('./indexo');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
dotenv.config({path:'./config.env'});
const DB=process.env.REMOTE_DB;
console.log(DB);
main().catch(err=>console.log(err));
async function main(){
   await mongoose.connect(DB);
   console.log('Database connected successfully');
}

  
const port=3001;
app.listen(port,()=>{
   console.log(`Server is listening to port ${port}`);
});
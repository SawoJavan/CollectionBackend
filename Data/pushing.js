const fs=require('fs')
const dotenv=require('dotenv');
 const {Products}=require('../Models/model');
 const mongoose=require('mongoose');

dotenv.config({path:'./config.env'});
//console.log(process.env);
//const DB=process.env.DATABASE_CONSTRING;/*.replace('<pasword>',process.env.PASSWORD);*/
const DB=process.env.LOCAL_DB;
console.log(DB);
main().catch(err=>console.log(err));
async function main(){
   await mongoose.connect(DB);
   console.log('Database connected successfully');
}
 const Data=JSON.parse(fs.readFileSync(`${__dirname}/data.json`,'utf-8'));
 //importing data to the database
 console.log(Data);
 const AddData=async ()=>{
    try{
        await Products.create(Data);
        console.log('Data sent succesfully');
        process.exit();
    }catch(err){
       console.log(err);
    }
    
 }
 const DeleteData=async ()=>{
    try{
        await Products.deleteMany();
        console.log('Data succesfully deleted');
        process.exit();
    }catch(err){
       console.log(err);
    }
    
 }

 //deleting existing data in the database
// console.log(process.argv);
 if(process.argv[2]==='--import'){
    AddData();
 }else if(process.argv[2]==='--delete'){
   DeleteData();
 }
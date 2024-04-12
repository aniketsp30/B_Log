const mongoose=require('mongoose');
const connBD=async()=>{
    try{
        mongoose.set('strictQuery',false);
        const con=await mongoose.connect(process.env.Mongo_url);
        console.log(`Database Connect:${con.connection.host}`);
    }catch(error){
        console.log(error);
    }
}
module.exports=connBD;
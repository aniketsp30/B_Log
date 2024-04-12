const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const userschem=new Schema({
    username:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        unique:true,
    }
})
module.exports=mongoose.model('user',userschem);
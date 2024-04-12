const express=require('express');
const router=express.Router();
const Post=require('../model/Post');

router.get('',async (req,res)=>{
    try{
        const local={
        title:"ABC",
        body:"hiiiiiii"
        }
        const data=await Post.find();
        res.render('index',{local,data});
    }catch(error){
        console.log(error);
    }

});

//see post
router.get('/posted/:id',async (req,res)=>{
    try{
        const local={
            title:"ABC",
            body:"hiiiiiii"
        }
        const slug=req.params.id;
        const data=await Post.findById({_id:slug});
        res.render('posted',{local,data});
    }catch(error){
        console.log(error);
    }

});

/*router.get('/about',async (req,res)=>{
    try {
        res.render("\about.html");
    } catch (error) {
        
    }
})
*/
module.exports=router;





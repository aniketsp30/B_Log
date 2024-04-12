const express=require('express');
const router=express.Router();
const Post=require('../model/Post');
const User=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const adminLayout="../Views/layouts/admin";
const jwtSecret=process.env.JWT_SECRET;


//Register
router.post('/register',async (req,res)=>{
   try{
        const { username, password }=req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        try {
            const user=await User.insertMany({username,password:hashedPassword});
            res.status(201);
            console.log(req.body);
        } catch (error) {
            if(req.body.title==="" || req.body.body===""){
                res.status(409).json({message:"Please enter username and password"});
            }
            if(error.code ===11000){
                res.status(409).json({message:"User already in use"});
            }
            res.status(500).json({message:'Internal server error'});
        }
    }catch(error) {
        console.log(error);
    }
});


//Check Login
const author=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorised"});
    }
    try {
        const decoded=jwt.verify(token,jwtSecret);
        req.userId=decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorised"});
    }
}

//Login page
router.get('/admin',async (req,res)=>{
    try{
        const local={
        title:"Admin",
        body:"hiiiiiii"
        }
        res.render('admin/index',{local, layout: adminLayout});
    }catch(error){
        console.log(error);
    }
});


//admin check login
router.post('/dashboard',async (req,res)=>{
    try{
        const { username, password }=req.body;
        console.log(req.body);
        const user=await User.findOne({ username});
        if(!user){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        const isPass=await bcrypt.compare(password,user.password);
        if(!isPass){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        const token=jwt.sign({userId: user._id},jwtSecret)
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard?id='+username);
    
    }catch(error){
        console.log(error);
    }

});

//admin dashboard
router.get('/dashboard',author,async(req,res)=>{
    try {
        const username=req.query.id;
        console.log(username);
        const local={
            title:"DashBoard",
            body:"hiiiiiii this Board"
            }
        const data=await Post.find({userId:username});
        res.render('admin/dashboard',{
            local,
            data,
            layout: adminLayout
        });
     
    } catch (error) {
        console.log(error);
    }
    })
    

//Create Post
router.get('/add-post',author,async(req,res)=>{
    try {
        const local={
            title:"Add post",
            body:"hiiiiiii this Board"
            }
        const data=await Post.find();
        res.render('admin/add-post',{
            local,
            layout: adminLayout
        });
     
    } catch (error) {
        console.log(error);
    }
});

//Create Post 2
router.post('/add-post',author,async(req,res)=>{
    try {
        console.log(req.body);
        try {
            const newPost=new Post({
                title: req.body.title,
                body: req.body.body,
                userId:req.body.username
            })
            
            const user=await Post.create(newPost);
            res.redirect('/dashboard?id='+req.body.username);
        } catch (error) {
            if(req.body.title==="" || req.body.body===""){
                res.status(409).json({message:"Please enter Blog Title or Description"});
                
            }
            console.log(error);
        }     
    } catch (error) {
        console.log(error);
    }
})
    

//Update Post
router.get('/edit-post/:id',author,async(req,res)=>{
    try {
        const local={
            title:"Edit post",
            body:"hiiiiiii this Board",
            userId:"users"
            };
        const data=await Post.findOne({_id:req.params.id});
        res.render('admin/edit-post',{
            local,
            data,
            layout: adminLayout
        });

       res.redirect(`/edit-post/${req.params.id}`);
     
    } catch (error) {
        console.log(error);
    }
});



//Create new post(Update Post)
router.put('/edit-post/:id',author,async(req,res)=>{
    try{
        const userS=req.body.username;
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            userId:req.body.username,
            UpdateAt:Date.now()
       });
       res.redirect('/dashboard?id='+userS);
     
    } catch (error) {
        console.log(error);
    }
});


//delete
router.post('/delete-post/:id',author,async(req,res)=>{
    try {
        const userS=req.body.username;
        await Post.deleteOne({_id:req.params.id});
        res.redirect('/dashboard?id='+userS);
    } catch (error) {
        console.log(error);
    }
});


//logout
router.get('/logout',(req,res)=>{
    res.clearCookie("token");
    res.redirect('/');
});


module.exports=router;

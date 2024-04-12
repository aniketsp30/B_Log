require('dotenv').config();

const express=require("express");
const mongos=require('mongoose');
const expressLayout=require('express-ejs-layouts')
const methodOverride=require('method-override');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const connDb=require('./server/config/db');
connDb();

const app=express();
const PORT=5000 || process.env.PORT;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.Mongo_url
    }),
    //cookie:{maxAge: new Date( Date.now()+(3600000))}
}))

app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static('Views'));

app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');


app.use('/',require('./server/route/main'));
app.use('/',require('./server/route/admin'));


app.listen(PORT,()=>{
    console.log(`App Listening on Port ${PORT}`);
});

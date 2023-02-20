const express = require ('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const app=express();
const engine=require('ejs-mate');
const DB_URI = 'mongodb://127.0.0.1:27017/escuela_db';

/**************SERVER*************/
app.set('port', process.env.PORT||5000);
app.listen(app.get('port'),()=>{
    console.log('Server on PORT', app.get('port'));
});

/************RESOURCES*********/
app.use(express.static(path.join(__dirname,'')));
app.use(express.static(path.join(__dirname, 'src/views')));
app.set('views', path.join(__dirname, 'src/views'));

/*************MIDDLEWARE*********/
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

/***************ROUTES***********/
app.use('/', require('./src/routes/indexRoutes'));

/*************ENGINE*********/
app.engine('ejs', engine);
app.set('view engine', 'ejs');

/****DATABASE****/
mongoose.connect(DB_URI, function(err){
    if(err){
        throw err;
    }else{
        console.log('Conexión establecida con la BD to', DB_URI );
    }
});

module.exports=app;
const express=require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/modelUser');
const Post = require('../models/modelPost');
const bodyParser = require('body-parser');

const usuarios=[];
// router.use(bodyParser.urlencoded({extends:true}));

router.get('/', function (req,res,next){
    Post.find({estado:"aprobado"},async(err, data)=>{
        const allPost = await data;
        res.render('index', {allPost});
    });
});

// POST method route
router.post('/', function (req, res) {
    res.send('POST request to the homepage');
});
  
router.get('/logout', function (req,res,next){
    Post.find({estado:"aprobado"},async(err, data)=>{
        const allPost = await data;
        res.render('index', {allPost});
    });
});

router.get('/sobreNosotros', function (req,res,next){
    res.render('sobreNosotros');
});
router.get('/dashDocente',async (req,res,next)=>{
    Post.find({estado:"espera"},async(err, data)=>{
        const allPost = await data;
        res.render('dashDocente', {allPost});
    });
});


router.get('/index', (req,res,next)=>{
    Post.find({estado:"aprobado"},async(err, data)=>{
        const allPost = await data;
        res.render('index', {allPost});
    });
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('/SingUp', (req,res)=>{
    res.render('SingUp');
});

router.get('/admin/:id',async (req, res,done)=>{
    console.log("PARAMETRO RECIBIDO", req.params.id);
    Post.findOne({_id:req.params.id},async(err, data)=>{
        console.log(data);
        const post = await data;
        res.render('adminPost', {post});
    });
});

router.get('/actualizarPost/:id',async (req, res,done)=>{
    console.log(req.params.id)
    Post.findByIdAndUpdate(req.params.id,{
        rol:req.params.rol,
        comentario:req.params.comentario,
        usuario:req.params.usuario,
        estado: "aprobado"
    }, (err, data)=>{
        Post.find({estado:"espera"},async(err, data)=>{
            const allPost = await data;
            res.redirect('/dashDocente');
        });
    });
    
});

router.get('/eventos', (req,res)=>{
    res.render('eventos');
});

router.get('/eliminarPost/:id',async (req, res,done)=>{
    console.log(req.params.id)
    Post.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.send("error", err);
        }else{
            Post.find({estado:"espera"},async(err, data)=>{
                const allPost = await data;
                res.redirect('/dashDocente');
            });
        
        } 
    });
    
});

/******AUTENTICAR USUARIO**********/
router.post('/autenticar',(req, res,done)=>{
    const {password, username}  = req.body; //obtenemos el usuario y el password
    User.findOne({password: password, usuario:username}, async(err, data)=>{
        if(err){
            res.status(500).send('ERROR AUTENTICAR USUARIO!!!');
        }else if(!data){
            res.status(500).send('USUARIO NO EXISTE EN LA BASE DE DATOS');
        }else{
            if(data.rol=="docente"){
                Post.find({estado:"espera"},async(err, data)=>{
                    const allPost = await data;
                    res.render('dashDocente', {allPost});
                });

            }else{
                let newUser={
                    nombres: (data.nombres), apellidos:data.apellidos, 
                    email: data.email, telefono:data.telefono, password:data.password, username:data.usuario, rol:data.rol
               }
               usuarios.push(newUser);
               res.render('postear', {newUser});
            }    
        }
    });

})

/*************REGISTRO COMENTARIO************/
router.post('/registrarComentario', (req,res,next)=>{
    console.log("REQ", req.body);
    const {usuario, rol, comentario} = req.body; //obtenemos el usuario y el password
    const post = new Post();
    post.usuario = usuario;
    post.rol=rol;
    post.comentario=comentario;
    post.estado="espera";
    post.save(err=>{
        console.log("error:", err);
        if(err){
            res.status(500).send("ERROR EN EL REGISTRO");
        }else{
            // res.status(200).send("POST REGISTRADO");
            res.redirect('/index');
        }
    });
});


/************REGISTRAR USUARIO*********/
router.post('/registrar', (req,res,next)=>{
    console.log("REQ", req.body);
    const {nombres, apellidos, email, telefono, passwordUser, username, rol} = req.body; //obtenemos el usuario y el password
    const usuario = new User();
    usuario.nombres = nombres;
    usuario.apellidos=apellidos;
    usuario.email=email;
    usuario.telefono= telefono;
    usuario.password= passwordUser;
    usuario.usuario=username;
    usuario.rol = rol;

    usuario.save(err=>{
        console.log("error:", err);
        if(err){
            res.status(500).send("ERROR EN EL REGISTRO");
        }else{
            res.status(200).send("USUARIO REGISTRADO");
        }
    });
});

module.exports = router;

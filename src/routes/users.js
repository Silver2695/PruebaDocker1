// Aqui el usuario podra ingresar a las url para registrarse o autenticarse
const express=require('express'); 
const router= express.Router();
const passport = require('passport');



// <----------------- RUTA PARA EL REGISTRO DE USUARIOS ------------------>
const User = require('../models/User');

router.get('/users/singin',(req,res)=>{
    res.render('users/singin.hbs');
});
router.post('/users/singin', async(req,res)=>{
    
    const {Nombre, Apellido, Email, password, password_conf}= req.body;
    let errors = [];
    if(Nombre.length <= 0){
        errors.push({text:'Inserte su nombre'});
    }
    if(Apellido.length <= 0){
        errors.push({text:'Inserte su Apellido'});
    }
    if(Email.length <= 0){
        errors.push({text:'Inserte su Email'});
    }
    if(password != password_conf){
        errors.push({text: 'No coincide el password'});
    }
    if(password.length < 4){
        errors.push({text: 'El password debe ser mayor a 4 caracteres'});
    }
    if(errors.length > 0){
        res.render('users/singin', {errors, Nombre, Apellido, Email, password, password_conf});
    } else{
       const emailuser=  await User.findOne({Email: Email});
       if(emailuser){
           req.flash('error_msg', 'El email ya esta en uso');
           res.redirect('/users/singin');
       }
       //Nuevo usuario
       const newUser = new User({Nombre, Apellido, Email, password});
       newUser.password= await newUser.encryptPassword(password);
       await newUser.save();
       res.redirect('/users/login');
    }
});

// <----------------- RUTA PARA EL ACCESO DE USUARIOS   ------------------>
router.get('/users/login',(req,res)=>{
    res.render('users/login.hbs');
});

router.post('/users/login',passport.authenticate('local',{
    successRedirect:'/books',
    failureRedirect:'/users/login',
    failureFlash:true
}));

// <----------------- AQUI SE REQUIERE EL MODELO DE User.js DE LA CARPETA MODELS --------------->
const SchemaLibro=require('../models/Libros.js');

router.post('/books/new-book',async(req,res)=>{
    const {id, titulo, editorial, autor, genero, pais, Npaginas, fecha}=req.body; // Campos enviados desde el formulario de new-book
    const errors=[];
    if(!id){
        errors.push({text:"Favor de llenar el campo ID"});
    }
    if(!titulo){
        errors.push({text:"Favor de llenar el campo Titulo"});
    }
    if(!autor){
        errors.push({text:"Favor de llenar el campo Autor"});
    }
    if(!editorial){
        errors.push({text:"Favor de llenar el campo Editorial"});
    }
    if(!genero){
        errors.push({text:"Favor de llenar el campo Genero"})
    }
    if(!pais){
        errors.push({text:"Favor de llenar el campo Pais"})
    }
    if(!Npaginas){
        errors.push({text:"Favor de llenar el campo Numero de Paginas"})
    }
    
    if(errors.length > 0){
        res.render("books/new-book",{
            errors,
            id,
            titulo,
            autor,
            editorial,
            genero,
            pais,
            Npaginas,
            fecha
        });
    }
    else{
        const NuevoLibro = new SchemaLibro({id,titulo,autor,editorial,genero,pais,Npaginas,fecha}); // 
        await NuevoLibro.save();
        //console.log(NuevoLibro);
        res.redirect('/books');
    }
    
});

// <----------------- RUTA PARA EL Logout DE LOS USUARIOS --------------->

router.get('/users/logout',(req,res)=>{
    req.logOut();
    res.redirect('/');
});

module.exports=router;
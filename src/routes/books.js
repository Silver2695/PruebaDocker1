// Aqui van las rutas para el crud de los libros
const express=require('express'); 
const router= express.Router();

// <----------------- AQUI SE REQUIERE EL MODELO DE Libros.js DE LA CARPETA MODELS --------------->
const SchemaLibro=require('../models/Libros.js');

const {isAuthenticated}=require('../helpers/auth.js')

// <----------------- RUTA PARA DE PRUEBAS ------------------>
router.get('/books/catalogo', isAuthenticated,(req,res)=>{
    res.render('books/catalogo');
});

// <----------------- RUTA PARA AGREGAR LIBROS ------------------>
router.get('/books/new-book',isAuthenticated,(req,res)=>{
    res.render('books/new-book');
});

// <----------------- RUTA PARA AGREGAR RECIBIR DATOS DE LIBROS ------------------>
router.post('/books/new-book', isAuthenticated, async(req,res)=>{
    const {id, titulo, editorial, autor, genero, pais, Npaginas, fecha}=req.body; // Campos enviados desde el formulario de new-book
    const errors=[];
    if(!id){
        errors.push({text:"Favor de llenar el campo Imagen"});
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
        errors.push({text:"Favor de llenar el campo Genero"});
    }
    if(!pais){
        errors.push({text:"Favor de llenar el campo Pais"});
    }
    if(!Npaginas){
        errors.push({text:"Favor de llenar el campo Descripcion"});
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
        const NuevoLibro = new SchemaLibro({id,titulo,autor,editorial,genero,pais,Npaginas,fecha}); 
        await NuevoLibro.save();
        //console.log(NuevoLibro);
        res.redirect('/books');
    }
    
});

//Todos los libros
router.get('/books', isAuthenticated, async (req, res) => {
    const libro = await SchemaLibro.find();
    res.render('books/catalogo', { libro });
  });

  //Borrar ibros
  router.delete('/books/delete/:id', isAuthenticated, async (req, res) => {
    await SchemaLibro.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/books');
  });

  //Editar Libros
  router.get('/books/edit/:id', isAuthenticated, async (req, res) => {
    const libro = await SchemaLibro.findById(req.params.id);
    res.render('books/edit', { libro });
  });
  
  router.post('/books/edit/:id', isAuthenticated, async (req, res) => {
    const { titulo, editorial } = req.body;
    await SchemaLibro.findByIdAndUpdate(req.params.id, {titulo, editorial});
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/books');
  });

module.exports=router;
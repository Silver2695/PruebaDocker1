// Aqui van las ur de la pagina principal
const express=require('express'); 
const router= express.Router();

// <------------------- RUTAS DE LA APLICACION ---------------------->
router.get('/',(req,res)=>{
    res.render('index.hbs');   //index.hbs de la ruta /views
});
// <------------------- RUTAS DE "ACERCA DE" ---------------------->
router.get('/about',(req,res)=>{
    res.render('about.hbs');  //about.hbs de la ruta /views
});


module.exports=router;


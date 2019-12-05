//Constantes requeridas

const express=require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport=require('passport');
const flash=require('connect-flash');
//Inicializaciones: 
const app=express();
require('./database'); // se requiere el archivo database para la conexion
require('./config/passport');
//Settings: Aqui van las configuraciones
    //Se configura el puerto 3000 para el servidor
    app.set('port',process.env.PORT || 3000);
    app.set('views',path.join(__dirname,'views')); //Aqui van a ir los archivos hbs de hadlebars

    //<------------------ CONFIGURACION VISTAS ---------------->
    app.engine('.hbs',exphbs({
        defaultLayout:'main',                                 //Marco o plantilla para las vistas de la aplicacion. Ubicacion views/layouts/main.hbs
        layoutsDir:path.join(app.get('views'),'layouts'),     //La direccion de la carpeta views se concatena con la carpeta de layouts
        partialsDir:path.join(app.get('views'),'partials'),   //Son pequeñas porciones de html reutilizables. Ubicacion views/partials, se cooncatena como con layouts
        extname:'.hbs'                                        // Se coloca la extencion de los archivos, en este caso .hbs de handlebars
    }));
    app.set('view engine','.hbs');                            // Configura el motor de las plantillas de vistas para poder ser usado, el cual es .hbs.
    //<------------------ CONFIGURACION VISTAS ---------------->

//Middlewares: Aqui van las funciones que seran ejecutadas antes de llegar al servidor o las rutas
app.use(express.urlencoded({extended:false}));  //Middleware para ecibir los datos enviados de los forms, extende para no recibir imagenes.
app.use(methodOverride('_method'));

// Configuraciones basicas de express, con ella se puede autenticar al usuario y almacenar los datos temporalmente.
app.use(session({
    secret: 'ProyectoCN',
    resave: true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Global Variables: Aqui se colocan datos para que estendisponibles para toda la aplicacion
app.use((req,res,next)=>{
    res.locals.error=req.flash('error');
    next();
})
//Routes: Aui van las rutas o Back-end
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/books'));
//Static Files: Aqui se define la carpeta de archivos estaticos

app.use(express.static(path.join(__dirname,'public')));

//Server listening: Aqui se inicializa el servidor de express

app.listen(app.get('port'),() =>{
    console.log('Servidor Activo en el puerto',app.get('port'));
});
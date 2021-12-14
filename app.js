const Debug = require('debug')('app:inicio');
//const dbBug = require('debug')('app:db');
const express = require("express");
const Joi = require('joi');
const app = express();
const morgan = require('morgan');
const config = require('config');

app.use(express.json());//Body
app.use(express.urlencoded({express:true}))
app.use(express.static('Public'));


// Configuracion de Entorno//////////////////////////////

console.log('Aplicacion: ' + config.get('Nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//////////////////////////////////////////////////////////


////////////// Uso de Middleware de Terceros -- Morgan

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    Debug('Morgan esta habilitado');

}

// Trabajando con la base de datos////

Debug('Conectado con la base de datos...');

//////////////////////////////////////////////////////////////////////

const Usuarios = [
    {id: 1 , nombre: 'Alejandro'},
    {id: 2 , nombre: 'Pablo'},
    {id: 3 , nombre: 'Alan'}
];

//////////////////////////////////////////////////////////////////////

app.get('/' , (req , res) =>{
    res.send('Hola Mundo desde Express...')
});

//////////////////////////////////////////////////////////////////////

app.get('/api/usuarios' , (req , res) =>{
    res.send(Usuarios);
});

//////////////////////////////////////////////////////////////////////

app.get('/api/usuarios/:id' , (req , res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no se encontro');
    res.send(usuario);
});

//////////////////////////////////////////////////////////////////////
app.post('/api/usuarios' , (req , res) =>{
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    });

    const {error , value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id: Usuarios.length + 1,
            nombre : value.nombre
        }
        Usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
    };

});

//////////////////////////////////////////////////////////////////////

app.put('/api/usuarios/:id' , (req , res) =>{
    

    let usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.status(404).send('El usuario no se encontro');
        return;  
    } 
    
    
    const {error , value} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
        
    
});

//////////////////////////////////////////////////////////////////////

app.delete('/api/usuarios/:id' , (req , res) =>{
    let usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = Usuarios.indexOf(usuario);
    Usuarios.splice(index , 1);
    res.send(usuario);
});


//////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 3000;

app.listen(port , () =>{
    console.log(`Escuchando desde el ${port}...`);
});
//////////////////////////////////////////////////////////////////////

const existeUsuario = (id) =>{
   return (Usuarios.find(u => u.id === parseInt(id)))
};

//////////////////////////////////////////////////////////////////////

const validarUsuario = (nom) =>{
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

   return (schema.validate({ nombre: nom})); 
};




//Funciones Middleware///////////////////////////////////////////////
// app.use(logger);
// app.use((req , res , next) =>{
//     console.log('Autenticando....');
//     next();
// });
////////////////////////////////////////////////////////////////////
//const logger = require('./logger');
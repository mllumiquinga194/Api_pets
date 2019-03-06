//Aquí creamos el servidor HTTP con nodejs utilizando express. este va a ser el motor de la aplicacion del BACKEND, va a ser el motor de nuestro API porque va a recibir las peticiones HTTP, vamos a poder crear controladores, vamos a poder crear rutas, cosas que son funcamentales de in FRAMEWORK de desarrollo a nivel de BACKEND. aqui va toda esa logica.
// Vamos a cargar la libreria de Express y Body-parser. vamos a llamar metodos de expres, vamos a cargar ficheros de rutas, vamos a configurar cabeceras, configurar body-parser.
'use strict'

const express = require('express');
const bodyParser = require('body-parser');


const app = express();

//cargar rutas
const user_routes = require('./routes/user');
const pet_routes = require('./routes/pet');

//Configurar body-parser

app.use(bodyParser.urlencoded({extended:false}));// Necesario para que body parser funcione
app.use(bodyParser.json());// Convertir a objetos JSON los datos que llegan por peticiones HTTP.

//Configurar cabeceras HTTP y cors

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Carga de rutas BASE

app.use('/api', user_routes); //para crear especie de middleware
app.use('/api', pet_routes); //para crear especie de middleware


module.exports = app; //Exportamos nuestro modulo para poder utilizar express dentro de otros ficheros que incluyan nuestro APP.
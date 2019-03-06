'use strict'

const mongoose = require('mongoose');
const app = require('./app');//Cargamos toda la configuracion que hagamos con Express, boduParser, cabeceras, rutas base..
require('./config/config');

//para evitar el error:
//(node:6568) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// mongoose.set('useCreateIndex', true);
// (node:1016) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
// mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log('La conexion a la base de datos está funcionando correctamente...');     

        //ponemos a nuestro puerto a escuchar
        app.listen(PORT, function(){
            console.log('Servidor del api rest de PETS escuchando en http://localhost:'+PORT);
        })
    }
});

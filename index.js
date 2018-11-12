'use strict'

var mongoose = require('mongoose');
var app = require('./app');//Cargamos toda la configuracion que hagamos con Express, boduParser, cabeceras, rutas base..
var port = process.env.PORT || 3977;

//para evitar el error:
//(node:6568) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);
// (node:1016) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/pets', { useNewUrlParser: true }, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log('La conexion a la base de datos está funcionando correctamente...');     

        //ponemos a nuestro puerto a escuchar
        app.listen(port, function(){
            console.log('Servidor del api rest de PETS escuchando en http://localhost:'+port);
        })
    }
});

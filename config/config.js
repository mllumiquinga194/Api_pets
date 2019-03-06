//========================PUERTO

PORT = process.env.PORT || 3977;


//========================ENTORNO

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';//si es dev, estoy en la base de datos de desarrollo

//========================VENCIMIENTO DEL TOKEN====
//60seg, 60min, 24hrs, 30dias

process.env.CADUCIDAD_TOKEN = '48h';


//=================SEED de AUTENTICAION
process.env.SEED = process.env.SEED || 'este-es-es-seed-desarrollo';

//========================BASEDATOS
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    //si es dev, estoy en la base de datos de desarrollo
    // LOCALES
    // urlDB = 'mongodb://localhost:27017/cafe';
    // urlDB = 'mongodb://localhost:27017/pets';

    // MONGO ATLAS

    // MARCOS
    // urlDB = 'mongodb+srv://mallth194:m.8162348@cluster0-cskwb.mongodb.net/pets';
    
    // ANDREA
    urlDB = 'mongodb+srv://mallth194:m.8162348@cluster0-gnqvm.mongodb.net/pets';
}else{
     //sino, uso la url de mlab de mongo que ya esta en heroku config
    urlDB = process.env.MONGO_URL;//mongo_URL ya fue definido en heroku config
}

process.env.URLDB = urlDB;


//===============GOOGLE CLIENT ID

// process.env.CLIENT_ID = process.env.CLIENT_ID || '128216496353-2cn5cdf29nberm9i3t10s70a7jd7h9j6.apps.googleusercontent.com';





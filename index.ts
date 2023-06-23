import Server from "./classes/server";
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import resultadoRoutes from './routes/resultado';
import fileUpload from 'express-fileupload';

const server = new Server();
//configurar cors 
server.app.use(cors({origin:true, credentials:true}));

//FileUpload
server.app.use(express.json({limit: '50mb'}));
server.app.use(express.urlencoded({limit: '50mb'}));

server.app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//rutas de mi aplicacion
server.app.use('/user', userRoutes);
server.app.use('/resultado', resultadoRoutes);
server.app.use('/actividad', require('./routes/actividad'));
server.app.use('/area', require('./routes/area'));
server.app.use('/asistencia', require('./routes/asistencia'));
server.app.use('/calendario', require('./routes/calendario'));
server.app.use('/carpeta', require('./routes/carpeta'));
server.app.use('/categoriaHerramienta', require('./routes/categoriaHerramienta'));
server.app.use('/categoria', require('./routes/categoria'));
server.app.use('/cursoCapacitacion', require('./routes/cursoCapacitacion'));
server.app.use('/miscursos', require('./routes/miscursos'));
server.app.use('/grado', require('./routes/grado'));
server.app.use('/herramienta', require('./routes/herramienta'));
server.app.use('/recurso', require('./routes/recurso'));
server.app.use('/unidad', require('./routes/unidad'));
server.app.use('/repositorio', require('./routes/repositorio'));
server.app.use('/admin', require('./routes/admin'));
server.app.use('/prueba', require('./routes/prueba'));
server.app.use('/resultado', require('./routes/resultados'));
server.app.use('/todo', require('./routes/busqueda'));


mongoose.set('useFindAndModify', false);
mongoose
    .connect('mongodb+srv://ramiro_app:ramiro_app@ramiro.qj8rwzg.mongodb.net/ramiro_p_app?retryWrites=true&w=majority', {
        useCreateIndex:true,
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    });
    console.log('BD CONECTADAA');

//levantar express
server.start ( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});







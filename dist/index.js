"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const resultado_1 = __importDefault(require("./routes/resultado"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = new server_1.default();
//configurar cors 
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//FileUpload
server.app.use(express_1.default.json({ limit: '50mb' }));
server.app.use(express_1.default.urlencoded({ limit: '50mb' }));
server.app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
//rutas de mi aplicacion
server.app.use('/user', usuario_1.default);
server.app.use('/resultado', resultado_1.default);
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
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default
    .connect('mongodb+srv://ramiro_app:ramiro_app@ramiro.qj8rwzg.mongodb.net/ramiro_p_app?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log('BD CONECTADAA');
//levantar express
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const curso_capacitaciones_model_1 = require("../models/curso_capacitaciones.model");
const cursoCapacitacionRouter = (0, express_1.Router)();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
});
//crear CursoCapacitacion 
cursoCapacitacionRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const imagen = req.files.imagen; // Suponiendo que el campo se llama "imagen" en tu formulario
    const archivo = req.files.recursos; // Suponiendo que el campo se llama "archivo" en tu formulario
    // Subir la imagen a Cloudinary
    cloudinary.uploader.upload(imagen.tempFilePath, { folder: "ramiro_app/capacitacionesPortadas", public_id: `${Date.now()}` }, (error, result) => {
        const pathUrl = result.secure_url;
        var urlArray = pathUrl.split('/');
        var lastTwoValues = urlArray[9];
        if (error) {
            console.log('Error al subir la imagen:', error);
            return res.status(500).json({ error: 'Error al subir la imagen' });
        }
        // Aquí puedes hacer algo con el resultado de la subida de la imagen si lo deseas
        // console.log('Imagen subida correctamente:', result);
        // Subir el archivo a Cloudinary
        cloudinary.uploader.upload(archivo.tempFilePath, { folder: "ramiro_app/capacitaciones", public_id: `${Date.now()}` }, (error, result2) => {
            const pathUrl2 = result2.secure_url;
            var urlArray2 = pathUrl2.split('/');
            var lastTwoValues2 = urlArray2[9];
            if (error) {
                console.log('Error al subir el archivo:', error);
                return res.status(500).json({ error: 'Error al subir el archivo' });
            }
            // Aquí puedes hacer algo con el resultado de la subida del archivo si lo deseas
            //   console.log('Archivo subido correctamente:', result2);
            var capacitacion = new curso_capacitaciones_model_1.CursoCapacitacion;
            capacitacion.nombre = body.nombre;
            capacitacion.descripcion = body.descripcion;
            capacitacion.usuario_id = body.usuario_id;
            capacitacion.fecha_inicio = body.fecha_inicio;
            capacitacion.fecha_fin = body.fecha_fin;
            capacitacion.duracion = body.duracion;
            capacitacion.tipo = body.tipo;
            capacitacion.imagen = lastTwoValues;
            capacitacion.recursos = lastTwoValues2;
            curso_capacitaciones_model_1.CursoCapacitacion.create(capacitacion).then(CursoCapacitacionDB => {
                res.json({
                    ok: true,
                    cursoCapacitacion: CursoCapacitacionDB
                });
            }).catch(err => {
                res.json(err);
            });
            // Devolver una respuesta al cliente
            //   return res.json({ imagen: result, archivo: result2 });
        });
    });
}));
//Obetner CursoCapacitacion
cursoCapacitacionRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [cursoCapacitacion, total] = yield Promise.all([
        curso_capacitaciones_model_1.CursoCapacitacion.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        curso_capacitaciones_model_1.CursoCapacitacion.countDocuments()
    ]);
    res.json({
        ok: true,
        cursoCapacitacion,
        total,
        id: req.id
    });
}));
//Obetner 1 cursoCapacitacionRouter por ID
cursoCapacitacionRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    curso_capacitaciones_model_1.CursoCapacitacion.find({ _id: body._id }, (err, CursoCapacitacionDB) => {
        if (err)
            throw err;
        if (CursoCapacitacionDB) {
            const cursoCapacitacion = CursoCapacitacionDB; //TRAE TODOS
            res.json({
                ok: true,
                cursoCapacitacion,
                mensaje: 'CursoCapacitacion encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'CursoCapacitacion no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar cursoCapacitacionRouter
cursoCapacitacionRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const cursoCapacitacion = {
        nombre: req.body.nombre,
        usuario_id: req.body.usuario_id,
        descripcion: req.body.descripcion,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        duracion: req.body.duracion,
        tipo: req.body.tipo,
    };
    curso_capacitaciones_model_1.CursoCapacitacion.findByIdAndUpdate(id, cursoCapacitacion, { new: true }, (err, cursoCapacitacion) => {
        if (err)
            throw err;
        if (!cursoCapacitacion) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            cursoCapacitacion
        });
    });
});
//Eliminar cursoCapacitacionRouter
cursoCapacitacionRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const cursoCapacitacion = yield curso_capacitaciones_model_1.CursoCapacitacion.findById(id);
        if (!cursoCapacitacion) {
            return res.status(404).json({
                ok: true,
                msg: 'CursoCapacitacion no encontrada por identificador'
            });
        }
        yield curso_capacitaciones_model_1.CursoCapacitacion.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'CursoCapacitacion eliminado'
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
//Exportar Excel
cursoCapacitacionRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        curso_capacitaciones_model_1.CursoCapacitacion.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = cursoCapacitacionRouter;

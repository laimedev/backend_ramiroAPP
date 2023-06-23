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
const miscursos_model_1 = require("../models/miscursos.model");
const misCursosRouter = (0, express_1.Router)();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
});
//crear CursoCapacitacion 
misCursosRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    miscursos_model_1.MisCursos.create(body).then(MisCursosDB => {
        res.json({
            ok: true,
            miscursos: MisCursosDB
        });
    }).catch(err => {
        res.json(err);
    });
}));
//Obetner CursoCapacitacion
misCursosRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [miscursos, total] = yield Promise.all([
        miscursos_model_1.MisCursos.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        miscursos_model_1.MisCursos.countDocuments()
    ]);
    res.json({
        ok: true,
        miscursos,
        total,
        id: req.id
    });
}));
//Obetner 1 cursoCapacitacionRouter por ID
misCursosRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    miscursos_model_1.MisCursos.find({ usuario_id: body.usuario_id }, (err, MisCursosDB) => {
        if (err)
            throw err;
        if (MisCursosDB) {
            const miscursos = MisCursosDB; //TRAE TODOS
            res.json({
                ok: true,
                miscursos,
                mensaje: 'Mis cursos encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Mis cursos  no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar cursoCapacitacionRouter
misCursosRouter.post('/update/:id', (req, res) => {
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
misCursosRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const miscursos = yield miscursos_model_1.MisCursos.findById(id);
        if (!miscursos) {
            return res.status(404).json({
                ok: true,
                msg: 'Mis cursos no encontrada por identificador'
            });
        }
        yield miscursos_model_1.MisCursos.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Mis cursos eliminado'
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
misCursosRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        curso_capacitaciones_model_1.CursoCapacitacion.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = misCursosRouter;

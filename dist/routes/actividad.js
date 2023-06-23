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
const actividad_model_1 = require("../models/actividad.model");
const actividadRouter = (0, express_1.Router)();
//crear Area 
actividadRouter.post('/', (req, res) => {
    const body = req.body;
    actividad_model_1.Actividad.create(body).then(ActividadDB => {
        res.json({
            ok: true,
            actividad: ActividadDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner Area
actividadRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [actividad, total] = yield Promise.all([
        actividad_model_1.Actividad.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        actividad_model_1.Actividad.countDocuments()
    ]);
    res.json({
        ok: true,
        actividad,
        total,
        id: req.id
    });
}));
//Obetner 1 Area por ID
actividadRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    actividad_model_1.Actividad.find({ _id: body._id }, (err, ActividadDB) => {
        if (err)
            throw err;
        if (ActividadDB) {
            const actividad = ActividadDB; //TRAE TODOS
            res.json({
                ok: true,
                actividad,
                mensaje: 'Actvidad encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Actividad no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Actividad
actividadRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const actividad = {
        nombre: req.body.nombre,
        capacitacion_id: req.body.capacitacion_id,
        descripcion: req.body.descripcion,
        tiempo: req.body.tiempo,
        calificacion: req.body.calificacion,
    };
    actividad_model_1.Actividad.findByIdAndUpdate(id, actividad, { new: true }, (err, actividad) => {
        if (err)
            throw err;
        if (!actividad) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            actividad
        });
    });
});
//Eliminar Actividad
actividadRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const actividad = yield actividad_model_1.Actividad.findById(id);
        if (!actividad) {
            return res.status(404).json({
                ok: true,
                msg: 'Actividad no encontrada por identificador'
            });
        }
        yield actividad_model_1.Actividad.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Actividad eliminado'
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
actividadRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        actividad_model_1.Actividad.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = actividadRouter;

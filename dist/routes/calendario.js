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
const calendario_model_1 = require("../models/calendario.model");
const calendarioRouter = (0, express_1.Router)();
//crear Calendario 
calendarioRouter.post('/', (req, res) => {
    const body = req.body;
    calendario_model_1.Calendario.create(body).then(CalendarioDB => {
        res.json({
            ok: true,
            calendario: CalendarioDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner Calendario
calendarioRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [calendario, total] = yield Promise.all([
        calendario_model_1.Calendario.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        calendario_model_1.Calendario.countDocuments()
    ]);
    res.json({
        ok: true,
        calendario,
        total,
        id: req.id
    });
}));
//Obetner 1 Calendario por ID
calendarioRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    calendario_model_1.Calendario.find({ _id: body._id }, (err, CalendarioDB) => {
        if (err)
            throw err;
        if (CalendarioDB) {
            const calendario = CalendarioDB; //TRAE TODOS
            res.json({
                ok: true,
                calendario,
                mensaCalendarioe: 'Calendario encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Calendario no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Calendario
calendarioRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const calendario = {
        usuario_id: req.body.usuario_id,
        titulo: req.body.titulo,
        detalles: req.body.detalles,
    };
    calendario_model_1.Calendario.findByIdAndUpdate(id, calendario, { new: true }, (err, calendario) => {
        if (err)
            throw err;
        if (!calendario) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            calendario
        });
    });
});
//Eliminar Calendario
calendarioRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const calendario = yield calendario_model_1.Calendario.findById(id);
        if (!calendario) {
            return res.status(404).json({
                ok: true,
                msg: 'Calendario no encontrada por identificador'
            });
        }
        yield calendario_model_1.Calendario.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Calendario eliminado'
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
calendarioRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        calendario_model_1.Calendario.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = calendarioRouter;

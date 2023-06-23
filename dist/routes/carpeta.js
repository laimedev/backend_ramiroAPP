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
const carpeta_model_1 = require("../models/carpeta.model");
const carpetaRouter = (0, express_1.Router)();
//crear Categoria 
carpetaRouter.post('/', (req, res) => {
    const body = req.body;
    carpeta_model_1.Carpeta.create(body).then(CarpetaDB => {
        res.json({
            ok: true,
            carpeta: CarpetaDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner Carpeta
carpetaRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [carpeta, total] = yield Promise.all([
        carpeta_model_1.Carpeta.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(12),
        carpeta_model_1.Carpeta.countDocuments()
    ]);
    res.json({
        ok: true,
        carpeta,
        total,
        id: req.id
    });
}));
//Obetner 1 Carpeta por ID
carpetaRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    carpeta_model_1.Carpeta.find({ repositorio_id: body.repositorio_id }, (err, CarpetaDB) => {
        if (err)
            throw err;
        if (CarpetaDB) {
            const carpeta = CarpetaDB; //TRAE TODOS
            res.json({
                ok: true,
                carpeta,
                mensaje: 'Carpeta encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Carpeta no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Obetner 1 Carpeta por ID DE USUARIO
carpetaRouter.post('/showByIDUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    carpeta_model_1.Carpeta.find({ _id: body._id }, (err, CarpetaDB) => {
        if (err)
            throw err;
        if (CarpetaDB) {
            const carpeta = CarpetaDB; //TRAE TODOS
            res.json({
                ok: true,
                carpeta,
                mensaje: 'User encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'User no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Carpeta
carpetaRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const carpeta = {
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        icono: req.body.icono,
        codigoSeccion: req.body.codigoSeccion,
    };
    carpeta_model_1.Carpeta.findByIdAndUpdate(id, carpeta, { new: true }, (err, carpeta) => {
        if (err)
            throw err;
        if (!carpeta) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            carpeta
        });
    });
});
//Eliminar Carpeta
carpetaRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const carpeta = yield carpeta_model_1.Carpeta.findById(id);
        if (!carpeta) {
            return res.status(404).json({
                ok: true,
                msg: 'Carpeta no encontrada por identificador'
            });
        }
        yield carpeta_model_1.Carpeta.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Carpeta eliminado'
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
carpetaRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        carpeta_model_1.Carpeta.find({})
            .sort({ _id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = carpetaRouter;

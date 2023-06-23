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
const grado_model_1 = require("../models/grado.model");
const gradoRouter = (0, express_1.Router)();
//crear Grado 
gradoRouter.post('/', (req, res) => {
    const body = req.body;
    grado_model_1.Grado.create(body).then(GradoDB => {
        res.json({
            ok: true,
            grado: GradoDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner Grado
gradoRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [grado, total] = yield Promise.all([
        grado_model_1.Grado.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        grado_model_1.Grado.countDocuments()
    ]);
    res.json({
        ok: true,
        grado,
        total,
        id: req.id
    });
}));
//Obetner 1 Grado por ID
gradoRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    grado_model_1.Grado.find({ _id: body._id }, (err, GradoDB) => {
        if (err)
            throw err;
        if (GradoDB) {
            const grado = GradoDB; //TRAE TODOS
            res.json({
                ok: true,
                grado,
                mensaje: 'Grado encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Grado no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Grado
gradoRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const grado = {
        nombre: req.body.nombre,
    };
    grado_model_1.Grado.findByIdAndUpdate(id, grado, { new: true }, (err, grado) => {
        if (err)
            throw err;
        if (!grado) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            grado
        });
    });
});
//Eliminar Grado
gradoRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const grado = yield grado_model_1.Grado.findById(id);
        if (!grado) {
            return res.status(404).json({
                ok: true,
                msg: 'Grado no encontrada por identificador'
            });
        }
        yield grado_model_1.Grado.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Grado eliminado'
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
gradoRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        grado_model_1.Grado.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = gradoRouter;

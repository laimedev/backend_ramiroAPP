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
const categoria_herramienta_model_1 = require("../models/categoria_herramienta.model");
const categoriaHerramientaRouter = (0, express_1.Router)();
//crear CategoriaHerramienta 
categoriaHerramientaRouter.post('/', (req, res) => {
    const body = req.body;
    categoria_herramienta_model_1.CategoriaHerramienta.create(body).then(CategoriaHerramientaDB => {
        res.json({
            ok: true,
            categoriaHerramienta: CategoriaHerramientaDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner CategoriaHerramienta
categoriaHerramientaRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [categoriaHerramienta, total] = yield Promise.all([
        categoria_herramienta_model_1.CategoriaHerramienta.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        categoria_herramienta_model_1.CategoriaHerramienta.countDocuments()
    ]);
    res.json({
        ok: true,
        categoriaHerramienta,
        total,
        id: req.id
    });
}));
//Obetner 1 CategoriaHerramienta por ID
categoriaHerramientaRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    categoria_herramienta_model_1.CategoriaHerramienta.find({ _id: body._id }, (err, CategoriaHerramientaDB) => {
        if (err)
            throw err;
        if (CategoriaHerramientaDB) {
            const categoriaHerramienta = CategoriaHerramientaDB; //TRAE TODOS
            res.json({
                ok: true,
                categoriaHerramienta,
                mensaje: 'CategoriaHerramienta encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'CategoriaHerramienta no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar categoriaHerramienta
categoriaHerramientaRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const categoriaHerramienta = {
        nombre: req.body.nombre,
        categoria_id: req.body.categoria_id,
        imagen: req.body.imagen,
        enlace: req.body.enlace
    };
    categoria_herramienta_model_1.CategoriaHerramienta.findByIdAndUpdate(id, categoriaHerramienta, { new: true }, (err, categoriaHerramienta) => {
        if (err)
            throw err;
        if (!categoriaHerramienta) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            categoriaHerramienta
        });
    });
});
//Eliminar categoriaHerramienta
categoriaHerramientaRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const categoriaHerramienta = yield categoria_herramienta_model_1.CategoriaHerramienta.findById(id);
        if (!categoriaHerramienta) {
            return res.status(404).json({
                ok: true,
                msg: 'CategoriaHerramienta no encontrada por identificador'
            });
        }
        yield categoria_herramienta_model_1.CategoriaHerramienta.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'CategoriaHerramienta eliminado'
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
categoriaHerramientaRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        categoria_herramienta_model_1.CategoriaHerramienta.find({})
            .sort({ _id: -1 })
        // .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = categoriaHerramientaRouter;

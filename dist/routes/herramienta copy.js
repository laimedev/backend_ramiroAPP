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
const herramientas_1 = require("../models/herramientas");
const categoria_model_1 = require("../models/categoria.model");
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
});
const herramientaRouter = (0, express_1.Router)();
//crear Herramienta 
herramientaRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { tempFilePath } = req.files.imagen;
    var resp = yield cloudinary.uploader.upload(tempFilePath, { folder: "ramiro_app/herramientas", public_id: `${Date.now()}`, width: 350 });
    const pathUrl = resp.secure_url;
    var urlArray = pathUrl.split('/');
    var lastTwoValues = urlArray[9];
    var herramienta = new herramientas_1.Herramienta;
    herramienta.categoria_id = body.categoria_id;
    herramienta.nombre = body.nombre;
    herramienta.descripcion = body.descripcion;
    herramienta.imagen = lastTwoValues;
    herramienta.enlace = body.enlace;
    yield herramientas_1.Herramienta.create(herramienta).then(HerramientaDB => {
        res.json({
            ok: true,
            herramienta: HerramientaDB
        });
    }).catch(err => {
        res.json(err);
    });
}));
//Obetner Herramienta
herramientaRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        const [herramientas, total] = yield Promise.all([
            herramientas_1.Herramienta.find()
                .sort({ _id: -1 })
                .skip(desde)
                .limit(5),
            herramientas_1.Herramienta.countDocuments(),
        ]);
        const categoriaIds = herramientas.map((h) => h.categoria_id);
        const categorias = yield categoria_model_1.Categoria.find({ _id: { $in: categoriaIds } });
        const herramientasConNombreCategoria = herramientas.map((h) => {
            const categoria = categorias.find((c) => c._id.equals(h.categoria_id));
            return Object.assign(Object.assign({}, h.toObject()), { categoria: categoria ? categoria.nombre : null });
        });
        res.json({
            ok: true,
            herramienta: herramientasConNombreCategoria,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
//Obetner 1 Herramienta por ID
herramientaRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    herramientas_1.Herramienta.find({ _id: body._id }, (err, HerramientaDB) => {
        if (err)
            throw err;
        if (HerramientaDB) {
            const herramienta = HerramientaDB; //TRAE TODOS
            res.json({
                ok: true,
                herramienta,
                mensaje: 'Herramienta encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Herramienta no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Herramienta
herramientaRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const herramienta = {
        categoria_id: req.body.categoria_id,
        nombre: req.body.nombre,
        imagen: req.body.imagen,
        enlace: req.body.enlace,
    };
    herramientas_1.Herramienta.findByIdAndUpdate(id, herramienta, { new: true }, (err, herramienta) => {
        if (err)
            throw err;
        if (!herramienta) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            herramienta
        });
    });
});
//Eliminar Herramienta
herramientaRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const herramienta = yield herramientas_1.Herramienta.findById(id);
        if (!herramienta) {
            return res.status(404).json({
                ok: true,
                msg: 'Herramienta no encontrada por identificador'
            });
        }
        yield herramientas_1.Herramienta.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Herramienta eliminado'
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
herramientaRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        herramientas_1.Herramienta.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = herramientaRouter;

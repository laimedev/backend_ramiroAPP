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
const recurso_model_1 = require("../models/recurso.model");
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
});
const recursoRouter = (0, express_1.Router)();
//crear Recuros 
recursoRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { tempFilePath } = req.files.imagen;
    var resp = yield cloudinary.uploader.upload(tempFilePath, { folder: "ramiro_app/recursos", public_id: `${Date.now()}`, width: 350 });
    const pathUrl = resp.secure_url;
    var urlArray = pathUrl.split('/');
    var lastTwoValues = urlArray[9];
    var recurso = new recurso_model_1.Recurso;
    recurso.carpeta_id = body.carpeta_id;
    recurso.nombre = body.nombre;
    recurso.imagen = lastTwoValues;
    yield recurso_model_1.Recurso.create(recurso).then(RecursoDB => {
        res.json({
            ok: true,
            recurso: RecursoDB
        });
    }).catch(err => {
        res.json(err);
    });
}));
//Obetner recursos
recursoRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [recurso, total] = yield Promise.all([
        recurso_model_1.Recurso.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        recurso_model_1.Recurso.countDocuments()
    ]);
    res.json({
        ok: true,
        recurso,
        total,
        id: req.id
    });
}));
// recursoRouter.get('/show', async (req, res) => {
//     try {
//       const desde = Number(req.query.desde) || 0;
//       const [herramientas, total] = await Promise.all([
//         Herramienta.find()
//           .sort({ _id: -1 })
//           .skip(desde)
//           .limit(5),
//         Herramienta.countDocuments(),
//       ]);
//       const categoriaIds = herramientas.map((h) => h.categoria_id);
//       const categorias = await Categoria.find({ _id: { $in: categoriaIds } });
//       const herramientasConNombreCategoria = herramientas.map((h) => {
//         const categoria = categorias.find((c) => c._id.equals(h.categoria_id));
//         return {
//           ...h.toObject(),
//           categoria: categoria ? categoria.nombre : null,
//         };
//       });
//       res.json({
//         ok: true,
//         herramienta: herramientasConNombreCategoria,
//         total,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error en el servidor' });
//     }
//   });
//Obetner 1 Herramienta por ID
recursoRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    recurso_model_1.Recurso.find({ carpeta_id: body.carpeta_id }, (err, RecursoDB) => {
        if (err)
            throw err;
        if (RecursoDB) {
            const recurso = RecursoDB; //TRAE TODOS
            res.json({
                ok: true,
                recurso,
                mensaje: 'recurso encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'recurso no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Herramienta
recursoRouter.post('/update/:id', (req, res) => {
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
//Eliminar recurso
recursoRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const recurso = yield recurso_model_1.Recurso.findById(id);
        if (!recurso) {
            return res.status(404).json({
                ok: true,
                msg: 'Recurso no encontrada por identificador'
            });
        }
        yield recurso_model_1.Recurso.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Recurso eliminado'
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
recursoRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        recurso_model_1.Recurso.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = recursoRouter;

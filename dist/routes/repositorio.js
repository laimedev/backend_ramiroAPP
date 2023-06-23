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
const repositorio_model_1 = require("../models/repositorio.model");
const area_model_1 = require("../models/area.model");
const admin_model_1 = require("../models/admin.model");
const repositorioRouter = (0, express_1.Router)();
//crear repositorio 
repositorioRouter.post('/', (req, res) => {
    const body = req.body;
    repositorio_model_1.Repositorio.create(body).then(RepositorioDB => {
        res.json({
            ok: true,
            repositorio: RepositorioDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//CODIGO MEJORADO 16
//Obetner repositorio
repositorioRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        const [repositorios, total] = yield Promise.all([
            repositorio_model_1.Repositorio.find()
                .sort({ _id: -1 })
                .skip(desde)
                .limit(5)
                .lean(),
            repositorio_model_1.Repositorio.countDocuments(),
        ]);
        const areaIds = repositorios.map((repositorio) => repositorio.area_id);
        const adminIds = repositorios.map((repositorio) => repositorio.usuario_id);
        const areas = yield area_model_1.Area.find({ _id: { $in: areaIds } }, 'nombre').lean();
        const admins = yield admin_model_1.Admin.find({ _id: { $in: adminIds } }, 'nombre').lean();
        const areaMap = areas.reduce((acc, area) => {
            acc[area._id] = area.nombre;
            return acc;
        }, {});
        const adminMap = admins.reduce((acc, admin) => {
            acc[admin._id] = admin.nombre;
            return acc;
        }, {});
        const repositoriosConNombres = repositorios.map((repositorio) => (Object.assign(Object.assign({}, repositorio), { area_id: areaMap[repositorio.area_id] || null, usuario_id: adminMap[repositorio.usuario_id] || null })));
        res.json({
            ok: true,
            repositorio: repositoriosConNombres,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
// repositorioRouter.get('/show', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;
//     const [ repositorio, total] =  await Promise.all([
//                                     Repositorio.find()
//                                     .sort({_id: -1})          
//                                     .skip( desde )
//                                     .limit( 5 ),
//                                     Repositorio.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         repositorio,
//         total,
//         id: req.id 
//     });
// });
//Obetner 1 Vehiculo por ID
repositorioRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    repositorio_model_1.Repositorio.find({ _id: body._id }, (err, RepositorioDB) => {
        if (err)
            throw err;
        if (RepositorioDB) {
            const repositorio = RepositorioDB; //TRAE TODOS
            res.json({
                ok: true,
                repositorio,
                mensaje: 'Repositorio encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Repositorio no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Vehiculo
repositorioRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const repositorio = {
        usuario_id: req.body.usuario_id,
        nombre: req.body.nombre,
        placa: req.body.placa,
        carpeta_id: req.body.carpeta_id,
        area_id: req.body.area_id,
    };
    repositorio_model_1.Repositorio.findByIdAndUpdate(id, repositorio, { new: true }, (err, repositorio) => {
        if (err)
            throw err;
        if (!repositorio) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            repositorio
        });
    });
});
//Eliminar repositorio
repositorioRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const repositorio = yield repositorio_model_1.Repositorio.findById(id);
        if (!repositorio) {
            return res.status(404).json({
                ok: true,
                msg: 'Repositorio no encontrada por identificador'
            });
        }
        yield repositorio_model_1.Repositorio.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Repositorio eliminado'
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
repositorioRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        repositorio_model_1.Repositorio.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = repositorioRouter;

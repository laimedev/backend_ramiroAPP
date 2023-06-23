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
const area_model_1 = require("../models/area.model");
const grado_model_1 = require("../models/grado.model");
const areaRouter = (0, express_1.Router)();
//crear Area 
areaRouter.post('/', (req, res) => {
    const body = req.body;
    area_model_1.Area.create(body).then(AreaDB => {
        res.json({
            ok: true,
            area: AreaDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner Area
areaRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        const [areas, total] = yield Promise.all([
            area_model_1.Area.find()
                .sort({ _id: -1 })
                .skip(desde)
                .limit(5)
                .lean(),
            area_model_1.Area.countDocuments(),
        ]);
        const gradoIds = areas.map((a) => a.grado_id);
        const grados = yield grado_model_1.Grado.find({ _id: { $in: gradoIds } }).lean();
        const areasConNombreGrado = areas.map((a) => {
            const grado = grados.find((g) => g._id.equals(a.grado_id));
            return Object.assign(Object.assign({}, a), { grado: grado ? grado.nombre : null });
        });
        res.json({
            ok: true,
            area: areasConNombreGrado,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
// areaRouter.get('/show', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;
//     const [ area, total] =  await Promise.all([
//         Area.find()
//                                     .sort({_id: -1})          
//                                     .skip( desde )
//                                     .limit( 5 ),
//                                     Area.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         area,
//         total,
//         id: req.id 
//     });
// });
//Obetner 1 Area por ID
areaRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    area_model_1.Area.find({ _id: body._id }, (err, AreaDB) => {
        if (err)
            throw err;
        if (AreaDB) {
            const area = AreaDB; //TRAE TODOS
            res.json({
                ok: true,
                area,
                mensaje: 'Area encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Area no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Area
areaRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const area = {
        nombre: req.body.nombre,
        grado_id: req.body.grado_id,
    };
    area_model_1.Area.findByIdAndUpdate(id, area, { new: true }, (err, area) => {
        if (err)
            throw err;
        if (!area) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            area
        });
    });
});
//Eliminar Area
areaRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const area = yield area_model_1.Area.findById(id);
        if (!area) {
            return res.status(404).json({
                ok: true,
                msg: 'Area no encontrada por identificador'
            });
        }
        yield area_model_1.Area.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Area eliminado'
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
areaRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        area_model_1.Area.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = areaRouter;

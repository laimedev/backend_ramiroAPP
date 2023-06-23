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
const asistencia_model_1 = require("../models/asistencia.model");
const asistenciaRouter = (0, express_1.Router)();
//Crear POST
// postRoutes.post('/', [verificaToken], (req: any, res: Response)=> {
//     const body = req.body;
//     body.usuario = req.usuario._id;
//     Post.create(body).then(async postDB => {
//         await postDB.populate('usuario').execPopulate();
//         res.json({
//             ok: true,
//             post: postDB
//         });
//     }).catch(err => {
//         res.json(err)
//     });
// } );
//crear Asistencia 
asistenciaRouter.post('/', (req, res) => {
    const body = req.body;
    asistencia_model_1.Asistencia.create(body).then((AsistenciaDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield AsistenciaDB.populate('User').execPopulate();
        res.json({
            ok: true,
            asistencia: AsistenciaDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//Obetner Asistencia
asistenciaRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [asistencia, total] = yield Promise.all([
        asistencia_model_1.Asistencia.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5)
            .populate('User', '-password'),
        asistencia_model_1.Asistencia.countDocuments()
    ]);
    res.json({
        ok: true,
        asistencia,
        total,
        id: req.id
    });
}));
//Obetner 1 Asistencia por ID
asistenciaRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    asistencia_model_1.Asistencia.find({ _id: body._id }, (err, AsistenciaDB) => {
        if (err)
            throw err;
        if (AsistenciaDB) {
            const asistencia = AsistenciaDB; //TRAE TODOS
            res.json({
                ok: true,
                asistencia,
                mensaje: 'Asistencia encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Asistencia no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Asistencia
asistenciaRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const asistencia = {
        nombre: req.body.nombre,
        usuario_id: req.body.usuario_id,
    };
    asistencia_model_1.Asistencia.findByIdAndUpdate(id, asistencia, { new: true }, (err, asistencia) => {
        if (err)
            throw err;
        if (!asistencia) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            asistencia
        });
    });
});
//Eliminar Asistencia
asistenciaRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const asistencia = yield asistencia_model_1.Asistencia.findById(id);
        if (!asistencia) {
            return res.status(404).json({
                ok: true,
                msg: 'Asistencia no encontrada por identificador'
            });
        }
        yield asistencia_model_1.Asistencia.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Asistencia eliminado'
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
asistenciaRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        asistencia_model_1.Asistencia.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = asistenciaRouter;

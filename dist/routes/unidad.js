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
const unidad_model_1 = require("../models/unidad.model");
const curso_capacitaciones_model_1 = require("../models/curso_capacitaciones.model");
const unidadRouter = (0, express_1.Router)();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
});
//crear Unidad 
unidadRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //     const body = req.body;
    //     Unidad.create(body).then(UnidadDB => {
    //         res.json ({
    //             ok:true,
    //             unidad: UnidadDB
    //         });
    //     }).catch( err => {
    //         res.json(err)
    //     });
    // });
    const body = req.body;
    const { tempFilePath } = req.files.material;
    var resp = yield cloudinary.uploader.upload(tempFilePath, { folder: "ramiro_app/unidades", public_id: `${Date.now()}` });
    const pathUrl = resp.secure_url;
    var urlArray = pathUrl.split('/');
    var lastTwoValues = urlArray[9];
    var unidad = new unidad_model_1.Unidad;
    unidad.id_capacitacion = body.id_capacitacion;
    unidad.nombre = body.nombre;
    unidad.video = body.video;
    unidad.tarea = body.tarea;
    unidad.tipo = body.tipo;
    unidad.meet = body.meet;
    unidad.material = lastTwoValues;
    yield unidad_model_1.Unidad.create(unidad).then(UnidadDB => {
        res.json({
            ok: true,
            unidad: UnidadDB
        });
    }).catch(err => {
        res.json(err);
    });
}));
//Obetner Unidad
unidadRouter.get('/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [unidad, total] = yield Promise.all([
        unidad_model_1.Unidad.find()
            // .sort({_id: -1})          
            .skip(desde)
            .limit(5),
        unidad_model_1.Unidad.countDocuments()
    ]);
    res.json({
        ok: true,
        unidad,
        total,
        id: req.id
    });
}));
//Obetner 1 Unidad por ID
unidadRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    unidad_model_1.Unidad.find({ _id: body._id }, (err, UnidadDB) => {
        if (err)
            throw err;
        if (UnidadDB) {
            const unidad = UnidadDB; //TRAE TODOS
            res.json({
                ok: true,
                unidad,
                mensaje: 'Unidad encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Unidad no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Obetner 1 Unidad por ID
unidadRouter.post('/showByIDCapacitacion', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //     const body = req.body;
    //     Unidad.find({id_capacitacion:body.id_capacitacion} , (err, UnidadDB) => {
    //         if( err ) throw err;
    //         if( UnidadDB ) {
    //             const unidad = UnidadDB;  //TRAE TODOS
    //             res.json({
    //                 ok: true,
    //                 unidad,
    //                 mensaje: 'Unidad encontrado!!'
    //             });
    //         } else {
    //             res.json({
    //                 ok: false,
    //                 mensaje: 'Unidad no encontrado en nuestro sistema!'
    //             });
    //         }
    //     }) 
    // });
    try {
        const body = req.body;
        const desde = Number(req.query.desde) || 0;
        const [herramientas] = yield Promise.all([
            unidad_model_1.Unidad.find({ id_capacitacion: body.id_capacitacion })
                // .sort({ _id: -1 })
                .skip(desde)
            // .limit(5),
            // Unidad.countDocuments(),
        ]);
        const capacitacionIds = herramientas.map((h) => h.id_capacitacion);
        // const tareaIds = herramientas.map((h) => h.tarea);
        const capacitaciones = yield curso_capacitaciones_model_1.CursoCapacitacion.find({ _id: { $in: capacitacionIds } });
        // const tareas = await Prueba.find({ _id: { $in: tareaIds } });
        const herramientasConNombreCategoria = herramientas.map((h) => {
            const capacitacion = capacitaciones.find((c) => c._id.equals(h.id_capacitacion));
            //   const tarea = tareas.find((c) => c._id.equals(h.tarea));
            return Object.assign(Object.assign({}, h.toObject()), { id_capacitacion: capacitacion ? capacitacion.nombre : null });
        });
        res.json({
            ok: true,
            unidad: herramientasConNombreCategoria,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
//Actualizar Unidad
unidadRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const unidad = {
        nombre: req.body.nombre,
        material: req.body.material,
        video: req.body.video,
        tarea: req.body.tarea,
        tipo: req.body.tipo,
        meet: req.body.meet,
    };
    unidad_model_1.Unidad.findByIdAndUpdate(id, unidad, { new: true }, (err, unidad) => {
        if (err)
            throw err;
        if (!unidad) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            unidad
        });
    });
});
//Eliminar Unidad
unidadRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const unidad = yield unidad_model_1.Unidad.findById(id);
        if (!unidad) {
            return res.status(404).json({
                ok: true,
                msg: 'Unidad no encontrada por identificador'
            });
        }
        yield unidad_model_1.Unidad.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Unidad eliminado'
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
unidadRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        unidad_model_1.Unidad.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = unidadRouter;

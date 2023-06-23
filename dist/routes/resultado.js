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
const resultados_model_1 = require("../models/resultados.model");
const usuario_model_1 = require("../models/usuario.model");
const unidad_model_1 = require("../models/unidad.model");
const resultadoRoutes = (0, express_1.Router)();
//Crear RESULTADO
// resultadoRoutes.post('/', [verificaToken], (req: any, res: Response)=> {
//     const body = req.body;
//     body.usuario = req.usuario._id;
//     Resultado.create(body).then(async resultadoDB => {
//         await resultadoDB.populate('usuario').execPopulate();
//         res.json({
//             ok: true,
//             resultado: resultadoDB
//         });
//     }).catch(err => {
//         res.json(err)
//     });
// } );
resultadoRoutes.post('/', (req, res) => {
    const body = req.body;
    resultados_model_1.Resultado.create(body).then(RepositorioDB => {
        res.json({
            ok: true,
            resultado: RepositorioDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obtener Resultados
resultadoRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const resultado = yield resultados_model_1.Resultado.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        resultado
    });
}));
//Obetner resultados x2
resultadoRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [resultado, total] = yield Promise.all([
        resultados_model_1.Resultado.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5)
            .populate('usuario', '-password'),
        resultados_model_1.Resultado.countDocuments()
    ]);
    res.json({
        ok: true,
        resultado,
        total,
        id: req.id
    });
}));
//Obetner resultados TODOS
resultadoRoutes.post('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const [resultados, total] = yield Promise.all([
            resultados_model_1.Resultado.find({ nombrePrueba: body.nombrePrueba }, ' -_id -pre1 -pre2')
                .sort({ _id: -1 })
                .lean(),
            resultados_model_1.Resultado.countDocuments(),
        ]);
        const areaIds = resultados.map((resultado) => resultado.usuario_id);
        const adminIds = resultados.map((resultado) => resultado.capacitacion_id);
        const usuarios = yield usuario_model_1.Usuario.find({ _id: { $in: areaIds } }, 'nombre').lean();
        const pruebas = yield unidad_model_1.Unidad.find({ _id: { $in: adminIds } }, 'nombre').lean();
        const areaMap = usuarios.reduce((acc, usuario) => {
            acc[usuario._id] = usuario.nombre;
            return acc;
        }, {});
        const adminMap = pruebas.reduce((acc, prueba) => {
            acc[prueba._id] = prueba.nombre;
            return acc;
        }, {});
        const repositoriosConNombres = resultados.map((resultados) => (Object.assign(Object.assign({}, resultados), { usuario_id: areaMap[resultados.usuario_id] || null, capacitacion_id: adminMap[resultados.capacitacion_id] || null })));
        res.json({
            ok: true,
            resultado: repositoriosConNombres,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
//Eliminar prueba
resultadoRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const resultado = yield resultados_model_1.Resultado.findById(id);
        if (!resultado) {
            return res.status(404).json({
                ok: true,
                msg: 'Resultado no encontrada por identificador'
            });
        }
        yield resultados_model_1.Resultado.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Resultado eliminado'
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
resultadoRoutes.post('/filtrar_resultado', (req, res) => {
    const body = req.body;
    resultados_model_1.Resultado.find({ usuario: body.usuario }, (err, resultadoDB) => {
        if (err)
            throw err;
        if (resultadoDB) {
            const resultado = resultadoDB; //TRAE TODOS
            res.json({
                ok: true,
                resultado,
                mensaje: 'Resultado del alumno encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Resultado del alumno no encontrado en nuestro sistema!'
            });
        }
    });
});
exports.default = resultadoRoutes;

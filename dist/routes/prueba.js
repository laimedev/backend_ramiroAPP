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
const pruebaRouter = (0, express_1.Router)();
const prueba_model_1 = require("../models/prueba.model");
const curso_capacitaciones_model_1 = require("../models/curso_capacitaciones.model");
const clasification_1 = require("../models/clasification");
//crear prueba 
pruebaRouter.post('/', (req, res) => {
    const body = req.body;
    prueba_model_1.Prueba.create(body).then(PruebaDB => {
        res.json({
            ok: true,
            prueba: PruebaDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//crear prueba 
pruebaRouter.post('/create/clasification', (req, res) => {
    const body = req.body;
    clasification_1.Clasification.create(body).then(ClasificationDB => {
        res.json({
            ok: true,
            clasification: ClasificationDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner prueba
pruebaRouter.get('/clasification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clasification = yield clasification_1.Clasification.find();
    res.json({
        ok: true,
        clasification
    });
}));
//Obetner reporte totales
pruebaRouter.get('/clasification/report', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clasifications = yield clasification_1.Clasification.find();
        const reports = [];
        clasifications.forEach((item) => {
            let countNormal = 0;
            let countCaries = 0;
            item.result.forEach((resultItem) => {
                if (resultItem.label === 'Normal') {
                    countNormal++;
                }
                else if (resultItem.label === 'Caries') {
                    countCaries++;
                }
            });
            reports.push({
                _id: item._id,
                countNormal,
                countCaries,
                date: item.date,
                title: item.title,
                description: item.description,
                result: item.result
                // Agrega otros campos que desees incluir en el informe
            });
        });
        res.json(reports);
    }
    catch (error) {
        console.error('Error en la consulta a la base de datos:', error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
}));
//Obetner prueba
pruebaRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = yield prueba_model_1.Prueba.find()
        .populate('admin', 'nombre img');
    res.json({
        ok: true,
        prueba
    });
}));
//Obetner 1 Prueba por ID
pruebaRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    prueba_model_1.Prueba.find({ _id: body._id }, (err, PruebaDB) => {
        if (err)
            throw err;
        if (PruebaDB) {
            const prueba = PruebaDB; //TRAE TODOS
            res.json({
                ok: true,
                prueba,
                mensaje: 'Prueba encontrado xd!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Prueba no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Obetner prueba x2
pruebaRouter.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //     const desde =  Number(req.query.desde) || 0;
    //     const [ prueba, total] =  await Promise.all([
    //                                     Prueba.find()
    //                                     .sort({_id: -1})          
    //                                     .skip( desde )
    //                                     .limit( 5 ),
    //                                     Prueba.countDocuments()
    //     ]);
    //     res.json({
    //         ok: true,
    //         prueba,
    //         total,
    //         id: req.id 
    //     });
    // });
    try {
        const desde = Number(req.query.desde) || 0;
        const [herramientas, total] = yield Promise.all([
            prueba_model_1.Prueba.find()
                .sort({ _id: -1 })
                .skip(desde)
                .limit(5),
            prueba_model_1.Prueba.countDocuments(),
        ]);
        const capacitacionIds = herramientas.map((h) => h.id_capacitacion);
        const capacitaciones = yield curso_capacitaciones_model_1.CursoCapacitacion.find({ _id: { $in: capacitacionIds } });
        const herramientasConNombreCategoria = herramientas.map((h) => {
            const capacitacion = capacitaciones.find((c) => c._id.equals(h.id_capacitacion));
            return Object.assign(Object.assign({}, h.toObject()), { id_capacitacion: capacitacion ? capacitacion.nombre : null });
        });
        res.json({
            ok: true,
            prueba: herramientasConNombreCategoria,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
//Actualizar prueba
pruebaRouter.post('/updatepre1/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre1: req.body.pre1
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre2/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre2: req.body.pre2
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre3/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre3: req.body.pre3
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre4/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre4: req.body.pre4
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre5/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre5: req.body.pre5
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre6/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre6: req.body.pre6
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre7/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre7: req.body.pre7
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre8/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre8: req.body.pre8
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre9/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre9: req.body.pre9
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Actualizar prueba
pruebaRouter.post('/updatepre10/:id', (req, res) => {
    const id = req.params.id;
    const prueba = {
        pre10: req.body.pre10
    };
    prueba_model_1.Prueba.findByIdAndUpdate(id, prueba, { new: true }, (err, prueba) => {
        if (err)
            throw err;
        if (!prueba) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            prueba
        });
    });
});
//Eliminar prueba
pruebaRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const prueba = yield prueba_model_1.Prueba.findById(id);
        if (!prueba) {
            return res.status(404).json({
                ok: true,
                msg: 'Prueba no encontrada por identificador'
            });
        }
        yield prueba_model_1.Prueba.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'prueba eliminado'
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
pruebaRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        prueba_model_1.Prueba.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = pruebaRouter;

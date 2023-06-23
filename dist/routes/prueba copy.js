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
const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middlewares/validar-jwt');
const prueba_model_1 = require("../models/prueba.model");
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
//Obetner prueba
pruebaRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = yield prueba_model_1.Prueba.find()
        .populate('admin', 'nombre img');
    res.json({
        ok: true,
        prueba
    });
}));
//Obetner prueba x2
pruebaRouter.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [prueba, total] = yield Promise.all([
        prueba_model_1.Prueba.find({}, '-imagen')
            .sort({ _id: -1 })
            .skip(desde)
            // .populate('prueba', '-imagen')
            .limit(5),
        prueba_model_1.Prueba.countDocuments()
    ]);
    res.json({
        ok: true,
        prueba: prueba,
        total,
        id: req.id
    });
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
            // prueba 
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
pruebaRouter.post('/pre_test', (req, res) => {
    const body = req.body;
    prueba_model_1.Prueba.findOne({ tituloPrueba: body.tituloPrueba }, (err, PruebaDB) => {
        if (err)
            throw err;
        if (PruebaDB) {
            const tituloPrueba = PruebaDB.tituloPrueba;
            // const prueba = PruebaDB;  //TRAE TODOS
            const prueba = ({
                _id: PruebaDB._id,
                codigoCurso: PruebaDB.codigoCurso,
                codigoCategoria: PruebaDB.codigoCategoria,
                tituloPrueba: PruebaDB.tituloPrueba,
                descripcionPrueba: PruebaDB.descripcionPrueba,
                created: PruebaDB.created,
                pre1: PruebaDB.pre1,
                pre2: PruebaDB.pre2,
                pre3: PruebaDB.pre3,
                pre4: PruebaDB.pre4,
                pre5: PruebaDB.pre5,
                pre6: PruebaDB.pre6,
                pre7: PruebaDB.pre7,
                pre8: PruebaDB.pre8,
                pre9: PruebaDB.pre9,
                pre10: PruebaDB.pre10,
            });
            // return res.json({
            res.json({
                ok: true,
                prueba,
                mensaje: 'Prueba encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Prueba no encontrado en nuestro sistema!'
            });
        }
    });
});
module.exports = pruebaRouter;

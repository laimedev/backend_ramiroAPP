"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prueba = void 0;
const mongoose_1 = require("mongoose");
const pruebaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    id_capacitacion: {
        type: String,
    },
    id_unidad: {
        type: String,
    },
    tituloPrueba: {
        type: String,
        required: true
    },
    descripcionPrueba: {
        type: String,
    },
    pre1: {
        type: String
    },
    pre2: {
        type: String
    },
    pre3: {
        type: String
    },
    pre4: {
        type: String
    },
    pre5: {
        type: String
    },
    pre6: {
        type: String
    },
    pre7: {
        type: String
    },
    pre8: {
        type: String
    },
    pre9: {
        type: String
    },
    pre10: {
        type: String
    }
});
pruebaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Prueba = (0, mongoose_1.model)('Prueba', pruebaSchema);

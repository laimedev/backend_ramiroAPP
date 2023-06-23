"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unidad = void 0;
const mongoose_1 = require("mongoose");
const unidadSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    id_capacitacion: {
        type: String,
    },
    nombre: {
        type: String,
    },
    material: {
        type: String,
    },
    video: {
        type: String,
    },
    tarea: {
        type: String,
    },
    tipo: {
        type: String,
    },
    meet: {
        type: String,
    }
});
unidadSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Unidad = (0, mongoose_1.model)('unidad', unidadSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actividad = void 0;
const mongoose_1 = require("mongoose");
const actividadSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    capacitacion_id: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    tiempo: {
        type: String,
    },
    calificacion: {
        type: String,
    }
});
actividadSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Actividad = (0, mongoose_1.model)('Actividad', actividadSchema);

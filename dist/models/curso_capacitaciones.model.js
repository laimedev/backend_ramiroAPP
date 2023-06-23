"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoCapacitacion = void 0;
const mongoose_1 = require("mongoose");
const cursoCapacitacionSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String,
        required: true
    },
    usuario_id: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    fecha_inicio: {
        type: Date,
    },
    fecha_fin: {
        type: Date,
    },
    duracion: {
        type: Number,
    },
    imagen: {
        type: String,
    },
    tipo: {
        type: String,
    },
    recursos: {
        type: String,
    }
});
cursoCapacitacionSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.CursoCapacitacion = (0, mongoose_1.model)('CursoCapacitacion', cursoCapacitacionSchema);

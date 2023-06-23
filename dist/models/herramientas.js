"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herramienta = void 0;
const mongoose_1 = require("mongoose");
const herramientaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    categoria_id: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    imagen: {
        type: String
    },
    enlace: {
        type: String
    },
});
herramientaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Herramienta = (0, mongoose_1.model)('Herramienta', herramientaSchema);

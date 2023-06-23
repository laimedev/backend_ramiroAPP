"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recurso = void 0;
const mongoose_1 = require("mongoose");
const recursoSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    carpeta_id: {
        type: String,
    },
    nombre: {
        type: String,
    },
    imagen: {
        type: String,
    },
});
recursoSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Recurso = (0, mongoose_1.model)('recurso', recursoSchema);

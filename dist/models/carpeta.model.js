"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carpeta = void 0;
const mongoose_1 = require("mongoose");
const carpetaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    grado_id: {
        type: String,
    },
    area_id: {
        type: String,
    },
    repositorio_id: {
        type: String,
    },
    nota: {
        type: String,
    },
    observaciones: {
        type: String
    },
});
carpetaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Carpeta = (0, mongoose_1.model)('carpeta', carpetaSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaHerramienta = void 0;
const mongoose_1 = require("mongoose");
const categoriaHerramientaSchema = new mongoose_1.Schema({
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
    imagen: {
        type: String
    },
    enlace: {
        type: String
    },
});
categoriaHerramientaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.CategoriaHerramienta = (0, mongoose_1.model)('categoriaHerramienta', categoriaHerramientaSchema);

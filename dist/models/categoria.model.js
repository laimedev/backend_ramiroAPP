"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoria = void 0;
const mongoose_1 = require("mongoose");
const categoriaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    codigo: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    // descripcion: {
    //     type: String
    // },
    // icono: {
    //     type: String
    // },
    // codigoSeccion: {
    //     type: String
    // }
});
categoriaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Categoria = (0, mongoose_1.model)('Categoria', categoriaSchema);

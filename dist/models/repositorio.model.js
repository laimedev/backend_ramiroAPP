"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repositorio = void 0;
const mongoose_1 = require("mongoose");
const repositorioSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    usuario_id: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    area_id: {
        type: String
    },
});
repositorioSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Repositorio = (0, mongoose_1.model)('repositorio', repositorioSchema);

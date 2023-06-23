"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resultado = void 0;
const mongoose_1 = require("mongoose");
const resultadosSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    capacitacion_id: {
        type: String
    },
    nombrePrueba: {
        type: String
    },
    nota: {
        type: String
    },
    observaciones: {
        type: String
    },
    usuario_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referencia a un usuario']
    },
    nombreUsuario: {
        type: String
    }
});
resultadosSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Resultado = (0, mongoose_1.model)('Resultado', resultadosSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asistencia = void 0;
const mongoose_1 = require("mongoose");
const asistenciaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    usuario_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});
asistenciaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Asistencia = (0, mongoose_1.model)('Asistencia', asistenciaSchema);

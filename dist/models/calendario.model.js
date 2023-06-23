"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendario = void 0;
const mongoose_1 = require("mongoose");
const calendarioSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    usuario_id: {
        type: String,
    },
    titulo: {
        type: String,
    },
    detalles: {
        type: String,
    },
});
calendarioSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Calendario = (0, mongoose_1.model)('calendario', calendarioSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grado = void 0;
const mongoose_1 = require("mongoose");
const gradoSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String,
    }
});
gradoSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Grado = (0, mongoose_1.model)('grado', gradoSchema);

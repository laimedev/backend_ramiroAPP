"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Area = void 0;
const mongoose_1 = require("mongoose");
const areaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    grado_id: {
        type: String,
    },
    nombre: {
        type: String,
    },
});
areaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Area = (0, mongoose_1.model)('area', areaSchema);

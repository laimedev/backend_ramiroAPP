"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clasification = void 0;
const mongoose_1 = require("mongoose");
const clasificationSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    date: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    result: {
        type: Array,
        default: []
    }
});
clasificationSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Clasification = (0, mongoose_1.model)('Clasification', clasificationSchema);

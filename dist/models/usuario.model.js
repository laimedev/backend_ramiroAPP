"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
var mongoose = require('mongoose'); // 1. require mongoose
var autoIncrement = require('mongoose-auto-increment');
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    foto: {
        type: String,
        default: ''
    },
    dni: {
        type: String,
        unique: true,
        required: [true, 'El documento de identidad es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    password_show: {
        type: String,
        item: null
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    email_inst: {
        type: String,
    },
    area_id: {
        type: String,
    },
    celular: {
        type: String,
        item: null
    },
    rol_id: {
        type: String,
        default: "1"
    },
    estado: {
        type: String,
    },
});
usuarioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
// autoIncrement.initialize(mongoose.connection); // 3. initialize autoIncrement 
// usuarioSchema.plugin(autoIncrement.plugin, 'User'); 
// usuarioSchema.plugin(autoIncrement.plugin, 'Usuario'); 
exports.Usuario = (0, mongoose_1.model)('User', usuarioSchema);
// export const Usuario = model<IUsuario>('Usuario', usuarioSchema);

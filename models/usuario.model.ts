import {Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
var mongoose = require('mongoose');  // 1. require mongoose
var autoIncrement = require('mongoose-auto-increment');

const usuarioSchema = new Schema({
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
        required: [ true, 'El documento de identidad es necesario']
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



usuarioSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bcrypt .compareSync(password, this.password)){
        return true;
    } else {
        return false;
    }
});




interface IUsuario extends Document {
    nombre: string;
    apellidos: string;
    foto: string;
    avatar: string;
    dni: number;
    rol_id: string;
    password: string;
    password_show: string;
    email: string;
    email_inst: string;
    area_id: string;
    celular: number;
    perfil: String;
    estado: string;
    compararPassword(password: string): boolean;
}


// autoIncrement.initialize(mongoose.connection); // 3. initialize autoIncrement 
// usuarioSchema.plugin(autoIncrement.plugin, 'User'); 
// usuarioSchema.plugin(autoIncrement.plugin, 'Usuario'); 

export const Usuario = model<IUsuario>('User', usuarioSchema);
// export const Usuario = model<IUsuario>('Usuario', usuarioSchema);

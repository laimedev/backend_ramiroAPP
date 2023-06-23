"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt = require('jsonwebtoken');
const validarJWT = (req, res = express_1.response, next) => {
    //Leer el token{}
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }
    try {
        const { id } = jwt.verify(token, 'codigo-token-fake');
        req.id = id;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
};
module.exports = { validarJWT };

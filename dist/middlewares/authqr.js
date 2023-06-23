"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaTokenQR = void 0;
const tokenQR_1 = __importDefault(require("../classes/tokenQR"));
const verificaTokenQR = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    tokenQR_1.default.comprobarTokenQR(userToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.usuario = decoded.usuario;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto',
        });
    });
};
exports.verificaTokenQR = verificaTokenQR;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaTokenSocio = void 0;
const tokenSocio_1 = __importDefault(require("../classes/tokenSocio"));
const verificaTokenSocio = (req, res, next) => {
    const socioToken = req.get('x-token') || '';
    tokenSocio_1.default.comprobarToken(socioToken)
        .then((decoded) => {
        console.log('Decoded', decoded);
        req.socio = decoded.socio;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto',
        });
    });
};
exports.verificaTokenSocio = verificaTokenSocio;

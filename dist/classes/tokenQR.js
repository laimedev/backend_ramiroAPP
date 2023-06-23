"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenQR {
    constructor() { }
    static getJwtTokenQR(payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    }
    static comprobarTokenQR(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    //no confiar
                    reject();
                }
                else {
                    //token valido
                    resolve(decoded);
                }
            });
        });
    }
}
TokenQR.seed = 'este-es-el-seed-de-clave-secreta-02';
TokenQR.caducidad = '10s';
exports.default = TokenQR;

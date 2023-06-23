"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenSocio {
    constructor() { }
    static getJwtToken(payload) {
        return jsonwebtoken_1.default.sign({
            socio: payload
        }, this.seed, { expiresIn: this.caducidad });
    }
    static comprobarToken(socioToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(socioToken, this.seed, (err, decoded) => {
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
TokenSocio.seed = 'este-es-el-seed-de-clave-secreta-02';
TokenSocio.caducidad = '300d';
exports.default = TokenSocio;

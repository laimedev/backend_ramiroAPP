import { NextFunction, response } from "express";
const jwt = require('jsonwebtoken');


const validarJWT = (req: any, res = response, next:NextFunction) => {

    //Leer el token{}
    const token = req.header('x-token');
    if( !token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }


    try {

        const { id } = jwt.verify( token, 'codigo-token-fake'   );
        req.id = id;
        next();

    } catch ( error ) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
 
}

module.exports = { validarJWT }
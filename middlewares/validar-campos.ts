import {Response, Request, NextFunction, response} from 'express'; 
import {  validationResult } from 'express-validator';


const validarCampos = (req: Request, res = response, next: NextFunction) => {
    
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();
}


module.exports = { validarCampos }
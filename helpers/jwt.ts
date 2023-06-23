
const jwt = require('jsonwebtoken');


const generarJWT = (id: any) => {

    return new Promise( (resolve, reject)=> {

        const payload = {
            id
        };
        
        jwt.sign(payload, 'codigo-token-fake',
            {expiresIn: '9h'},
            (err: any, token: any) => {
    
            if(err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
    
            });

    });
    
    
}




module.exports = { generarJWT,  }
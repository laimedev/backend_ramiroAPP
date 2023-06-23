import { Router, Response, Request, response } from 'express';
import { check, validationResult } from 'express-validator';


const adminRouter = Router();

const { googleVerify } = require('../helpers/google-verify');


import { Admin } from "../models/admin.model";

import  bcrypt  from 'bcrypt';
import { getMenuFrontEnd } from '../helpers/menu-frontend';

const { generarJWT } = require ('../helpers/jwt'); 

const { validarJWT } = require('../middlewares/validar-jwt');




//Reiniciar Sesion Administrador
adminRouter.get('/renew', validarJWT, async (req: any, res= response) => { 
    const id = req.id;
     //Generar el Token -JWT
     const token = await  generarJWT(id);


    const admin = await Admin.findById(id);

    res.json({
        ok: true,
        token,
        admin,
        menu: getMenuFrontEnd(admin?.role)
        
    });
});








//Iniciar Sesion Administrador
adminRouter.post('/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty()
    ],
    async  (req: Request, res = response) => { 


    const { email, password} = req.body;

    try { 

        //Verificar email
        const adminDB = await Admin.findOne({ email });
        if( !adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valida'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, adminDB.password);  

        if ( !validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar el Token -JWT
        const token = await  generarJWT(adminDB.id);



        res.json({
            ok: true,
            // msg: 'Hola Laime esto es LOGIN'
            token,
            admin: adminDB,
            role: adminDB.role,
            menu: getMenuFrontEnd(adminDB.role)
        


        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }
});




//Obetner Administradores
adminRouter.get('/', validarJWT, async (req: any, res: any) => {


    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    // const admin = await Admin.find({}, 'nombre email role google')
    //                                 .skip( desde )
    //                                 .limit( 5 );

    // const total = await Admin.countDocuments();   
    
    const [ admin, total] =  await Promise.all([
        Admin.find({})
        // Admin.find({}, 'nombre email role  sedeATP google')

                                    .skip( desde )
                                    .sort({_id: -1}) 
                                    .limit( 5 ),

                                    Admin.countDocuments()
    ]);

    res.json({
        ok: true,
        admin,
        total,
        id: req.id 
    });



    
});









//Actualizar Administradores
adminRouter.put('/:id',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role',  'El role es obligatorio').not().isEmpty(),
    ],
    async  (req: Request, res = response) => {

    // TODO:  validar token y comprobar si es el usuario correcto
    const id = req.params.id;
    try {
        const adminDB = await Admin.findById( id );
        if(!adminDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un administrador por ese identificador'
            });
        }
        // Actualizaciones
        const  {  password, google, email, ...campos} = req.body;
        if( adminDB.email !== email  ) {
            const existeEmail = await Admin.findOne({  email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }  
        }

        campos.email = email;
        const adminActualizado = await Admin.findByIdAndUpdate(id, campos, { new: true });
        res.json({
            ok: true,
            admin: adminActualizado
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
});







//BorrarAdministrador
adminRouter.delete('/:id',  async  (req: Request, res = response) => { 


        const id = req.params.id;

        try {


            const adminDB = await Admin.findById( id );
            if(!adminDB){
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un administrador por ese identificador'
                });
            }


            await Admin.findByIdAndDelete(id);

            res.json({
                ok: true,
                // id
                msg: 'Administrador eliminado.'
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }



});








//Crear Administradores
adminRouter.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // check('password', 'El password es obligatorio').not().isEmpty(),
        check('email',  'El email es obligatorio').isEmail(),
    ],
    async  (req: Request, res = response) => {

    console.log(req.body);



    const { email, password, password_show } = req.body;





    

    const errores = validationResult(req);

    if( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    try {

        const exiteEmail = await Admin.findOne({ email });
        if(exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const admin = new Admin(req.body);


        // Encriptar Contraseña

        const salt = bcrypt.genSaltSync();


        admin.password_show =  req.body.password_show,
        
        admin.password = bcrypt.hashSync(req.body.password_show, 10),


        // admin.password = bcrypt.hashSync(password, salt);
        

        


        // Guardar Contraseña
        await admin.save();


        //Generar el Token -JWT
        const token = await  generarJWT(admin.id);


        res.json({
            ok: true,
            admin,
            token,
            menu: getMenuFrontEnd(admin.role)

        });

    } catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


    

});





//Obetner 1 admin por ID
adminRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Admin.find({_id:body._id} , (err: any, adminDB) => {
        if( err ) throw err;
        if( adminDB ) {
            const admin = adminDB;  //TRAE TODOS
            res.json({
                ok: true,
                admin,
                mensaje: 'Admin encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Admin no encontrado en nuestro sistema!'
            });
        }
    }) 
});



//Actualizar Contraseña del ADMINISTRADOR Seleccionado
adminRouter.post('/update_pass/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const admin = {
        nombre: req.body.nombre || req.admin.nombre,
        role: req.body.role || req.admin.role,
        sedeATP: req.body.sedeATP || req.admin.sedeATP,
        email: req.body.email || req.admin.email,

        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
    }
    Admin.findByIdAndUpdate(id, admin, {new: true}, (err, admin) => {
        if(err) throw err;
        if(!admin){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }

        res.json({
            ok: true,
            msg: 'Contraseña actualizada correctamente',
            admin
            
        });admin
    })
});



//ACTUALIZAR INFO POR DNI
adminRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const admin = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        role: req.body.role || req.usuario.role,
        password_show:  req.body.password_show,
        password: bcrypt.hashSync(req.body.password_show, 10),
    }
    Admin.findByIdAndUpdate(id, admin, {new: true}, (err, admin) => {
        if(err) throw err;
        if(!admin){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            msg: 'Admin actualizado correctamente',
            admin
            
        });admin
    })
});



//Exportar Excel
adminRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Admin.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});



module.exports =  adminRouter;


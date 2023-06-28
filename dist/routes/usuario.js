"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const nodemailer_1 = __importDefault(require("nodemailer"));
const carpeta_model_1 = require("../models/carpeta.model");
const userRoutes = (0, express_1.Router)();
//login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    // SELECT * FROM table 
    // SELECT * from table where telefeno
    usuario_model_1.Usuario.findOne({ dni: body.dni }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                apellidos: userDB.apellidos,
                dni: userDB.dni,
                rol_id: userDB.rol_id,
                password: userDB.password,
                password_show: userDB.password_show,
                email: userDB.email,
                email_inst: userDB.email_inst,
                celular: userDB.celular,
                area_id: userDB.area_id,
                perfil: userDB.perfil,
                estado: userDB.estado,
            });
            const id = userDB._id;
            usuario_model_1.Usuario.findById(id, (err, usuario) => {
                if (err)
                    throw err;
                const id = usuario === null || usuario === void 0 ? void 0 : usuario.id;
                res.json({
                    ok: true,
                    numero_documento: body.numero_documento,
                    id: id,
                    token: tokenUser
                });
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos ****'
            });
        }
    });
});
// METODOS
// POST -> GUARDAR O ENVIAR 
// GET -> OBETENER
// DELETE -> ELEMINAR
// UPDATE -> ACTUALIZAR
//crear usuario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        dni: req.body.dni,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
        email: req.body.email,
        celular: req.body.celular,
        area_id: req.body.area_id,
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellidos: userDB.apellidos,
            dni: userDB.dni,
            password: userDB.password,
            password_show: userDB.password_show,
            email: userDB.email,
            celular: userDB.celular,
            area_id: userDB.area_id,
        });
        res.json({
            ok: true,
            token: tokenUser,
            id: userDB._id
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
userRoutes.post('/create2', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        dni: req.body.dni,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
        email: req.body.email,
        celular: req.body.celular,
        area_id: req.body.area_id,
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        res.json({
            ok: true,
            user: userDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Actualizar Contraseña del Usuario Seleccionado
userRoutes.post('/update_pass/:id', (req, res) => {
    const id = req.params.id;
    const usuario = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        email: req.body.email || req.usuario.email,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
    };
    usuario_model_1.Usuario.findByIdAndUpdate(id, usuario, { new: true }, (err, usuario) => {
        if (err)
            throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        var transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "ramiro@gmail.com",
                pass: "@D3v@tP*___"
            }
        });
        var mailOptions = {
            from: "ramiro@gmail.com",
            to: usuario.email,
            subject: "ACCESOS RAMIRO APP - IMPORTANTE",
            html: `<html><head><title>RAMIRO APP</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://deliverydindon.com/assets/img/landing/mapa.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>BIENVENIDO Chamo, tu registro fue un exito.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos son los siguientes: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>USUARIO: dindon@gmail.com </li> <li>CLAVE:  *&$#*_% </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://admin.amazonastrading.com.pe/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send(error.message);
            }
            else {
                res.json({
                    ok: true,
                    msg: 'Email enviado'
                });
                console.log("Email enviado");
            }
        });
        res.json({
            ok: true,
            msg: 'Contraseña actualizada correctamente',
            usuario
        });
        usuario;
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
//Obetner Usuarios x2
// userRoutes.get('/obtener', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;
//     console.log(desde);
//     const [ usuario, total] =  await Promise.all([
//                                     Usuario.find()
//                                     .sort({_id: -1})          
//                                     // .populate('usuario', 'nombre celular email dni avatar')
//                                     .skip( desde )
//                                     .limit( 10 ),
//                                     Usuario.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         usuario,
//         total,
//         id: req.id 
//     });
// });
userRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        const [usuarios, total] = yield Promise.all([
            usuario_model_1.Usuario.find()
                .sort({ _id: -1 })
                .skip(desde)
                .limit(5)
                .lean(),
            usuario_model_1.Usuario.countDocuments(),
        ]);
        const areaIds = usuarios.map((usuarios) => usuarios.area_id);
        const areas = yield carpeta_model_1.Carpeta.find({ _id: { $in: areaIds } }, 'nota').lean();
        const areaMap = areas.reduce((acc, area) => {
            acc[area._id] = area.nota;
            return acc;
        }, {});
        const areasConNombres = usuarios.map((usuarios) => (Object.assign(Object.assign({}, usuarios), { area_id: areaMap[usuarios.area_id] || null })));
        res.json({
            ok: true,
            usuario: areasConNombres,
            total,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}));
//Borrar 
userRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    usuario_model_1.Usuario.findByIdAndRemove(id, (err, usuario) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Usuario APP Eliminado',
            body: usuario
        });
    });
});
//OBTENER INFO POR DNI
userRoutes.get('/view/:id', (req, res) => {
    const id = req.params.id;
    usuario_model_1.Usuario.findById(id, (err, usuario) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Informacion Usuario',
            user: usuario
        });
    });
});
//ACTUALIZAR INFO POR DNI
userRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const usuario = {
        nombre: req.body.nombre || req.usuario.nombre,
        apellidos: req.body.apellidos || req.usuario.apellidos,
        dni: req.body.dni || req.usuario.dni,
        email: req.body.email || req.usuario.email,
        celular: req.body.celular || req.usuario.celular,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
        area_id: req.body.area_id || req.usuario.area_id,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(id, usuario, { new: true }, (err, usuario) => {
        if (err)
            throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario
        });
        usuario;
    });
});
//ACTUALIZAR INFO POR DNI
userRoutes.post('/updateAPP/:id', (req, res) => {
    const id = req.params.id;
    const usuario = {
        nombre: req.body.nombre || req.usuario.nombre,
        apellidos: req.body.apellidos || req.usuario.apellidos,
        dni: req.body.dni || req.usuario.dni,
        email: req.body.email || req.usuario.email,
        celular: req.body.celular || req.usuario.celular
    };
    usuario_model_1.Usuario.findByIdAndUpdate(id, usuario, { new: true }, (err, usuario) => {
        if (err)
            throw err;
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario
        });
        usuario;
    });
});
userRoutes.post('/consultarDNI', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ dni: body.dni }, (err, userDB) => {
        if (err)
            throw err;
        if (userDB) {
            const user = userDB;
            res.json({
                ok: true,
                user,
                mensaje: 'Usurio encontrado, ahora ingresa la asistencia!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Usuario no encontrado en nuestro sistema!'
            });
        }
    });
});
userRoutes.post('/forget_password', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ numero_documento: body.numero_documento }, (err, userDB) => {
        if (err)
            throw err;
        if (userDB) {
            const email = userDB.email;
            const user = userDB;
            // return res.json({
            res.json({
                ok: true,
                email: email,
                user,
                mensaje: 'Usurio encontrado, se le enviara la contraseña a su correo electronico!!'
            });
            // var transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            // port: 465,
            // secure: true,
            // auth: {
            //     user: "systemdevsperu@gmail.com",
            //     pass: "fncjqrrblnfljaal"
            // }
            // });
            // var mailOptions = {
            //     from: "systemdevsperu@gmail.com",
            //     to: user.email,
            //     subject: "CONTRASEÑA RECUPERADA",
            //     html: `<html><head><title>NEW APP 2023</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://laimedev.com/proyectos/logo_appu_rec.png' width='50%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #FE4F00; margin: 0 0 7px'>HOLA  <p style="color: #EFD378"> ${user.nombre} </p> tus datos fueron recuperados.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${user.numero_documento} </li> <li>CLAVE:  ${user.password_show} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/' target='_blank'> <img src='https://play.google.com/intl/es-419/badges/static/images/badges/es-419_badge_web_generic.png'  width='40%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>APPU San Carlos</p></div></td></tr></table></body></html>`
            // }
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if(error) {
            //         res.status(500).send(error.message);
            //     } else {
            //         res.json({
            //             ok: true,
            //             msg: 'Email enviado'
            //         });
            //         console.log("Email enviado");
            //     }
            // });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Usuario no encontrado en nuestro sistema!'
            });
        }
    });
});
// ll
//Obetner Usuarios TODOS
userRoutes.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [usuario] = yield Promise.all([
        // Usuario.find({}, ' -_id nombre email celular dni password password_show ubicacion departamento provincia region push farmerid avatar')
        usuario_model_1.Usuario.find()
            .sort({ _id: -1 })
    ]);
    res.json({
        ok: true,
        usuario,
    });
}));
userRoutes.post('/send-email', (req, res) => {
    var transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "systemdevsperu@gmail.com",
            pass: "fncjqrrblnfljaal"
        }
    });
    var mailOptions = {
        from: "systemdevsperu@gmail.com",
        to: "alaimes64@gmail.com",
        subject: "Enviado desde nodemailer XX",
        text: "Hola  como haz estado, nos metemos una peli de hackers :x",
        html: "<p style='background: green; color: red;'>HTML version of the message</p> <br> <br> <h1>Hoooola </h1>"
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).send(error.message);
        }
        else {
            res.json({
                ok: true,
                msg: 'Email enviado'
            });
            console.log("Email enviado");
        }
    });
});
//Obetner 1 UsuarioDB por ID
userRoutes.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    usuario_model_1.Usuario.find({ _id: body._id }, (err, UsuarioDB) => {
        if (err)
            throw err;
        if (UsuarioDB) {
            const usuario = UsuarioDB; //TRAE TODOS
            res.json({
                ok: true,
                usuario,
                mensaje: 'usuario encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'usuario no encontrado en nuestro sistema!'
            });
        }
    });
}));
exports.default = userRoutes;

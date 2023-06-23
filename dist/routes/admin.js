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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const adminRouter = (0, express_1.Router)();
const { googleVerify } = require('../helpers/google-verify');
const admin_model_1 = require("../models/admin.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const menu_frontend_1 = require("../helpers/menu-frontend");
const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middlewares/validar-jwt');
//Reiniciar Sesion Administrador
adminRouter.get('/renew', validarJWT, (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    //Generar el Token -JWT
    const token = yield generarJWT(id);
    const admin = yield admin_model_1.Admin.findById(id);
    res.json({
        ok: true,
        token,
        admin,
        menu: (0, menu_frontend_1.getMenuFrontEnd)(admin === null || admin === void 0 ? void 0 : admin.role)
    });
}));
//Iniciar Sesion Administrador
adminRouter.post('/login', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty()
], (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //Verificar email
        const adminDB = yield admin_model_1.Admin.findOne({ email });
        if (!adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valida'
            });
        }
        //Verificar contraseña
        const validPassword = bcrypt_1.default.compareSync(password, adminDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }
        //Generar el Token -JWT
        const token = yield generarJWT(adminDB.id);
        res.json({
            ok: true,
            // msg: 'Hola Laime esto es LOGIN'
            token,
            admin: adminDB,
            role: adminDB.role,
            menu: (0, menu_frontend_1.getMenuFrontEnd)(adminDB.role)
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }
}));
//Obetner Administradores
adminRouter.get('/', validarJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    // const admin = await Admin.find({}, 'nombre email role google')
    //                                 .skip( desde )
    //                                 .limit( 5 );
    // const total = await Admin.countDocuments();   
    const [admin, total] = yield Promise.all([
        admin_model_1.Admin.find({})
            // Admin.find({}, 'nombre email role  sedeATP google')
            .skip(desde)
            .sort({ _id: -1 })
            .limit(5),
        admin_model_1.Admin.countDocuments()
    ]);
    res.json({
        ok: true,
        admin,
        total,
        id: req.id
    });
}));
//Actualizar Administradores
adminRouter.put('/:id', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('role', 'El role es obligatorio').not().isEmpty(),
], (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO:  validar token y comprobar si es el usuario correcto
    const id = req.params.id;
    try {
        const adminDB = yield admin_model_1.Admin.findById(id);
        if (!adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un administrador por ese identificador'
            });
        }
        // Actualizaciones
        const _a = req.body, { password, google, email } = _a, campos = __rest(_a, ["password", "google", "email"]);
        if (adminDB.email !== email) {
            const existeEmail = yield admin_model_1.Admin.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const adminActualizado = yield admin_model_1.Admin.findByIdAndUpdate(id, campos, { new: true });
        res.json({
            ok: true,
            admin: adminActualizado
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}));
//BorrarAdministrador
adminRouter.delete('/:id', (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const adminDB = yield admin_model_1.Admin.findById(id);
        if (!adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un administrador por ese identificador'
            });
        }
        yield admin_model_1.Admin.findByIdAndDelete(id);
        res.json({
            ok: true,
            // id
            msg: 'Administrador eliminado.'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
//Crear Administradores
adminRouter.post('/', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('password', 'El password es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
], (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, password, password_show } = req.body;
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    try {
        const exiteEmail = yield admin_model_1.Admin.findOne({ email });
        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        const admin = new admin_model_1.Admin(req.body);
        // Encriptar Contraseña
        const salt = bcrypt_1.default.genSaltSync();
        admin.password_show = req.body.password_show,
            admin.password = bcrypt_1.default.hashSync(req.body.password_show, 10),
            // admin.password = bcrypt.hashSync(password, salt);
            // Guardar Contraseña
            yield admin.save();
        //Generar el Token -JWT
        const token = yield generarJWT(admin.id);
        res.json({
            ok: true,
            admin,
            token,
            menu: (0, menu_frontend_1.getMenuFrontEnd)(admin.role)
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}));
//Obetner 1 admin por ID
adminRouter.post('/showByID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    admin_model_1.Admin.find({ _id: body._id }, (err, adminDB) => {
        if (err)
            throw err;
        if (adminDB) {
            const admin = adminDB; //TRAE TODOS
            res.json({
                ok: true,
                admin,
                mensaje: 'Admin encontrado!!'
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Admin no encontrado en nuestro sistema!'
            });
        }
    });
}));
//Actualizar Contraseña del ADMINISTRADOR Seleccionado
adminRouter.post('/update_pass/:id', (req, res) => {
    const id = req.params.id;
    const admin = {
        nombre: req.body.nombre || req.admin.nombre,
        role: req.body.role || req.admin.role,
        sedeATP: req.body.sedeATP || req.admin.sedeATP,
        email: req.body.email || req.admin.email,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
    };
    admin_model_1.Admin.findByIdAndUpdate(id, admin, { new: true }, (err, admin) => {
        if (err)
            throw err;
        if (!admin) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            msg: 'Contraseña actualizada correctamente',
            admin
        });
        admin;
    });
});
//ACTUALIZAR INFO POR DNI
adminRouter.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const admin = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        role: req.body.role || req.usuario.role,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
    };
    admin_model_1.Admin.findByIdAndUpdate(id, admin, { new: true }, (err, admin) => {
        if (err)
            throw err;
        if (!admin) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            msg: 'Admin actualizado correctamente',
            admin
        });
        admin;
    });
});
//Exportar Excel
adminRouter.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield Promise.all([
        admin_model_1.Admin.find({})
            .sort({ id: -1 })
    ]);
    res.json({
        ok: true,
        data,
    });
}));
module.exports = adminRouter;

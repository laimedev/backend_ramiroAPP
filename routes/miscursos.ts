import { Router, Response, Request, response } from 'express';
import { CursoCapacitacion } from '../models/curso_capacitaciones.model';
import { MisCursos } from '../models/miscursos.model';
const misCursosRouter = Router();

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
})



//crear CursoCapacitacion 
misCursosRouter.post('/' , async  (req: any, res: Response ) => {
    const body = req.body;
    MisCursos.create(body).then(MisCursosDB => {
        res.json ({
            ok:true,
            miscursos: MisCursosDB
        });
    }).catch( err => {
        res.json(err)
    });
});




//Obetner CursoCapacitacion
misCursosRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ miscursos, total] =  await Promise.all([
        MisCursos.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    MisCursos.countDocuments()
    ]);
    res.json({
        ok: true,
        miscursos,
        total,
        id: req.id 
    });
});


//Obetner 1 cursoCapacitacionRouter por ID
misCursosRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    MisCursos.find({usuario_id:body.usuario_id} , (err, MisCursosDB) => {
        if( err ) throw err;
        if( MisCursosDB ) {
            const miscursos = MisCursosDB;  //TRAE TODOS
            res.json({
                ok: true,
                miscursos,
                mensaje: 'Mis cursos encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Mis cursos  no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar cursoCapacitacionRouter
misCursosRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const cursoCapacitacion = {
        nombre: req.body.nombre,
        usuario_id: req.body.usuario_id,
        descripcion: req.body.descripcion,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        duracion: req.body.duracion,
        tipo: req.body.tipo,
    }
    CursoCapacitacion.findByIdAndUpdate(id, cursoCapacitacion, {new: true}, (err, cursoCapacitacion) => {
        if(err) throw err;
        if(!cursoCapacitacion){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            cursoCapacitacion 
        })
    })
});


//Eliminar cursoCapacitacionRouter
misCursosRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const miscursos = await MisCursos.findById(id);
        if(!miscursos) {
            return res.status(404).json({
                ok: true,
                msg: 'Mis cursos no encontrada por identificador'
            });
        }
        await MisCursos.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Mis cursos eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
misCursosRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    CursoCapacitacion.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  misCursosRouter;
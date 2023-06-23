import { Router, Response, Request, response } from 'express';
import { Asistencia } from '../models/asistencia.model';
const asistenciaRouter = Router();



//Crear POST
// postRoutes.post('/', [verificaToken], (req: any, res: Response)=> {
//     const body = req.body;
//     body.usuario = req.usuario._id;
//     Post.create(body).then(async postDB => {
//         await postDB.populate('usuario').execPopulate();
//         res.json({
//             ok: true,
//             post: postDB
//         });
//     }).catch(err => {
//         res.json(err)
//     });
// } );




//crear Asistencia 
asistenciaRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Asistencia.create(body).then(async AsistenciaDB => {
        await AsistenciaDB.populate('User').execPopulate();
        res.json ({
            ok:true,
            asistencia: AsistenciaDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Asistencia
asistenciaRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ asistencia, total] =  await Promise.all([
        Asistencia.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 )
                                    .populate('User','-password'),
                                    Asistencia.countDocuments()
    ]);
    res.json({
        ok: true,
        asistencia,
        total,
        id: req.id 
    });
});


//Obetner 1 Asistencia por ID
asistenciaRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Asistencia.find({_id:body._id} , (err, AsistenciaDB) => {
        if( err ) throw err;
        if( AsistenciaDB ) {
            const asistencia = AsistenciaDB;  //TRAE TODOS
            res.json({
                ok: true,
                asistencia,
                mensaje: 'Asistencia encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Asistencia no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Asistencia
asistenciaRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const asistencia = {
        nombre: req.body.nombre,
        usuario_id: req.body.usuario_id,
    }
    Asistencia.findByIdAndUpdate(id, asistencia, {new: true}, (err, asistencia) => {
        if(err) throw err;
        if(!asistencia){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            asistencia 
        })
    })
});


//Eliminar Asistencia
asistenciaRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const asistencia = await Asistencia.findById(id);
        if(!asistencia) {
            return res.status(404).json({
                ok: true,
                msg: 'Asistencia no encontrada por identificador'
            });
        }
        await Asistencia.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Asistencia eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
asistenciaRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
        Asistencia.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  asistenciaRouter;
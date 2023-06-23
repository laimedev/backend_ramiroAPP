import { Router, Response, Request, response } from 'express';
import { Actividad } from '../models/actividad.model';
const actividadRouter = Router();

//crear Area 
actividadRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Actividad.create(body).then(ActividadDB => {
        res.json ({
            ok:true,
            actividad: ActividadDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Area
actividadRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ actividad, total] =  await Promise.all([
        Actividad.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    Actividad.countDocuments()
    ]);
    res.json({
        ok: true,
        actividad,
        total,
        id: req.id 
    });
});


//Obetner 1 Area por ID
actividadRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Actividad.find({_id:body._id} , (err, ActividadDB) => {
        if( err ) throw err;
        if( ActividadDB ) {
            const actividad = ActividadDB;  //TRAE TODOS
            res.json({
                ok: true,
                actividad,
                mensaje: 'Actvidad encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Actividad no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Actividad
actividadRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const actividad = {
        nombre: req.body.nombre,
        capacitacion_id: req.body.capacitacion_id,
        descripcion: req.body.descripcion,
        tiempo: req.body.tiempo,
        calificacion: req.body.calificacion,
    }
    Actividad.findByIdAndUpdate(id, actividad, {new: true}, (err, actividad) => {
        if(err) throw err;
        if(!actividad){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            actividad 
        })
    })
});


//Eliminar Actividad
actividadRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const actividad = await Actividad.findById(id);
        if(!actividad) {
            return res.status(404).json({
                ok: true,
                msg: 'Actividad no encontrada por identificador'
            });
        }
        await Actividad.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Actividad eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
actividadRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
        Actividad.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  actividadRouter;
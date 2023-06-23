import { Router, Response, Request, response } from 'express';
import { Calendario } from '../models/calendario.model';
const calendarioRouter = Router();

//crear Calendario 
calendarioRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Calendario.create(body).then(CalendarioDB => {
        res.json ({
            ok:true,
            calendario: CalendarioDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Calendario
calendarioRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ calendario, total] =  await Promise.all([
        Calendario.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    Calendario.countDocuments()
    ]);
    res.json({
        ok: true,
        calendario,
        total,
        id: req.id 
    });
});


//Obetner 1 Calendario por ID
calendarioRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Calendario.find({_id:body._id} , (err, CalendarioDB) => {
        if( err ) throw err;
        if( CalendarioDB ) {
            const calendario = CalendarioDB;  //TRAE TODOS
            res.json({
                ok: true,
                calendario,
                mensaCalendarioe: 'Calendario encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Calendario no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Calendario
calendarioRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const calendario = {
        usuario_id: req.body.usuario_id,
        titulo: req.body.titulo,
        detalles: req.body.detalles,
    }
    Calendario.findByIdAndUpdate(id, calendario, {new: true}, (err, calendario) => {
        if(err) throw err;
        if(!calendario){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            calendario 
        })
    })
});


//Eliminar Calendario
calendarioRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const calendario = await Calendario.findById(id);
        if(!calendario) {
            return res.status(404).json({
                ok: true,
                msg: 'Calendario no encontrada por identificador'
            });
        }
        await Calendario.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Calendario eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
calendarioRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Calendario.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  calendarioRouter;
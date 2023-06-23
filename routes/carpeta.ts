import { Router, Response, Request, response } from 'express';
import { Carpeta } from '../models/carpeta.model';
const carpetaRouter = Router();

//crear Categoria 
carpetaRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Carpeta.create(body).then(CarpetaDB => {
        res.json ({
            ok:true,
            carpeta: CarpetaDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Carpeta
carpetaRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ carpeta, total] =  await Promise.all([
        Carpeta.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 12 ),
                                    Carpeta.countDocuments()
    ]);
    res.json({
        ok: true,
        carpeta,
        total,
        id: req.id 
    });
});


//Obetner 1 Carpeta por ID
carpetaRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Carpeta.find({repositorio_id:body.repositorio_id} , (err, CarpetaDB) => {
        if( err ) throw err;
        if( CarpetaDB ) {
            const carpeta = CarpetaDB;  //TRAE TODOS
            res.json({
                ok: true,
                carpeta,
                mensaje: 'Carpeta encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Carpeta no encontrado en nuestro sistema!'
            });
        }
    }) 
});




//Obetner 1 Carpeta por ID DE USUARIO
carpetaRouter.post('/showByIDUser', async (req: any, res: any) => {
    const body = req.body;
    Carpeta.find({_id:body._id} , (err, CarpetaDB) => {
        if( err ) throw err;
        if( CarpetaDB ) {
            const carpeta = CarpetaDB;  //TRAE TODOS
            res.json({
                ok: true,
                carpeta,
                mensaje: 'User encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'User no encontrado en nuestro sistema!'
            });
        }
    }) 
});




//Actualizar Carpeta
carpetaRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const carpeta = {
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        icono: req.body.icono,
        codigoSeccion: req.body.codigoSeccion,
    }
    Carpeta.findByIdAndUpdate(id, carpeta, {new: true}, (err, carpeta) => {
        if(err) throw err;
        if(!carpeta){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            carpeta 
        })
    })
});


//Eliminar Carpeta
carpetaRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const carpeta = await Carpeta.findById(id);
        if(!carpeta) {
            return res.status(404).json({
                ok: true,
                msg: 'Carpeta no encontrada por identificador'
            });
        }
        await Carpeta.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Carpeta eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
carpetaRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Carpeta.find({})
                                    .sort({_id: -1})          

    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  carpetaRouter;
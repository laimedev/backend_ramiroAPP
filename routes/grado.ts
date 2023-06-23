import { Router, Response, Request, response } from 'express';
import { Grado } from '../models/grado.model';
const gradoRouter = Router();

//crear Grado 
gradoRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Grado.create(body).then(GradoDB => {
        res.json ({
            ok:true,
            grado: GradoDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Grado
gradoRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ grado, total] =  await Promise.all([
        Grado.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    Grado.countDocuments()
    ]);
    res.json({
        ok: true,
        grado,
        total,
        id: req.id 
    });
});


//Obetner 1 Grado por ID
gradoRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Grado.find({_id:body._id} , (err, GradoDB) => {
        if( err ) throw err;
        if( GradoDB ) {
            const grado = GradoDB;  //TRAE TODOS
            res.json({
                ok: true,
                grado,
                mensaje: 'Grado encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Grado no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Grado
gradoRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const grado = {
        nombre: req.body.nombre,
    }
    Grado.findByIdAndUpdate(id, grado, {new: true}, (err, grado) => {
        if(err) throw err;
        if(!grado){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            grado 
        })
    })
});


//Eliminar Grado
gradoRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const grado = await Grado.findById(id);
        if(!grado) {
            return res.status(404).json({
                ok: true,
                msg: 'Grado no encontrada por identificador'
            });
        }
        await Grado.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Grado eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
gradoRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Grado.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  gradoRouter;
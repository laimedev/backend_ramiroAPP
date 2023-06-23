import { Router, Response, Request, response } from 'express';
import { CategoriaHerramienta } from '../models/categoria_herramienta.model';
const categoriaHerramientaRouter = Router();

//crear CategoriaHerramienta 
categoriaHerramientaRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    CategoriaHerramienta.create(body).then(CategoriaHerramientaDB => {
        res.json ({
            ok:true,
            categoriaHerramienta: CategoriaHerramientaDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner CategoriaHerramienta
categoriaHerramientaRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ categoriaHerramienta, total] =  await Promise.all([
        CategoriaHerramienta.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    CategoriaHerramienta.countDocuments()
    ]);
    res.json({
        ok: true,
        categoriaHerramienta,
        total,
        id: req.id 
    });
});


//Obetner 1 CategoriaHerramienta por ID
categoriaHerramientaRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    CategoriaHerramienta.find({_id:body._id} , (err, CategoriaHerramientaDB) => {
        if( err ) throw err;
        if( CategoriaHerramientaDB ) {
            const categoriaHerramienta = CategoriaHerramientaDB;  //TRAE TODOS
            res.json({
                ok: true,
                categoriaHerramienta,
                mensaje: 'CategoriaHerramienta encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'CategoriaHerramienta no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar categoriaHerramienta
categoriaHerramientaRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const categoriaHerramienta = {
        nombre: req.body.nombre,
        categoria_id: req.body.categoria_id,
        imagen: req.body.imagen,
        enlace: req.body.enlace
    }
    CategoriaHerramienta.findByIdAndUpdate(id, categoriaHerramienta, {new: true}, (err, categoriaHerramienta) => {
        if(err) throw err;
        if(!categoriaHerramienta){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            categoriaHerramienta 
        })
    })
});


//Eliminar categoriaHerramienta
categoriaHerramientaRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const categoriaHerramienta = await CategoriaHerramienta.findById(id);
        if(!categoriaHerramienta) {
            return res.status(404).json({
                ok: true,
                msg: 'CategoriaHerramienta no encontrada por identificador'
            });
        }
        await CategoriaHerramienta.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'CategoriaHerramienta eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
categoriaHerramientaRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    CategoriaHerramienta.find({})
                                    .sort({_id: -1})  
                                    // .sort({id: -1})    

    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  categoriaHerramientaRouter;
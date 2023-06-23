import { Router, Response, Request, response } from 'express';
import { Categoria } from '../models/categoria.model';
const categoriaRouter = Router();

//crear Categoria 
categoriaRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Categoria.create(body).then(CategoriaDB => {
        res.json ({
            ok:true,
            categoria: CategoriaDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Categoria
categoriaRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ categoria, total] =  await Promise.all([
        Categoria.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    Categoria.countDocuments()
    ]);
    res.json({
        ok: true,
        categoria,
        total,
        id: req.id 
    });
});


//Obetner 1 Categoria por ID
categoriaRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Categoria.find({_id:body._id} , (err, CategoriaDB) => {
        if( err ) throw err;
        if( CategoriaDB ) {
            const categoria = CategoriaDB;  //TRAE TODOS
            res.json({
                ok: true,
                categoria,
                mensaje: 'Categoria encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Categoria no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Categoria
categoriaRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const categoria = {
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        // descripcion: req.body.descripcion,
        // icono: req.body.icono,
        // codigoSeccion: req.body.codigoSeccion,
    }
    Categoria.findByIdAndUpdate(id, categoria, {new: true}, (err, categoria) => {
        if(err) throw err;
        if(!categoria){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            categoria 
        })
    })
});


//Eliminar Categoria
categoriaRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const categoria = await Categoria.findById(id);
        if(!categoria) {
            return res.status(404).json({
                ok: true,
                msg: 'Categoria no encontrada por identificador'
            });
        }
        await Categoria.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Categoria eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
categoriaRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Categoria.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  categoriaRouter;
import { Router, Response, Request, response } from 'express';
import { Herramienta } from '../models/herramientas';
import { Categoria } from '../models/categoria.model';
import { Recurso } from '../models/recurso.model';
const path = require('path');

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
})


const recursoRouter = Router();

//crear Recuros 
recursoRouter.post('/' , async   (req: any, res: Response ) => {

    const body = req.body;
    const   { tempFilePath  }   =  req.files.imagen;
    var resp = await cloudinary.uploader.upload( tempFilePath,{folder:"ramiro_app/recursos" ,public_id: `${Date.now()}`, width: 350});
    const pathUrl = resp.secure_url;
    var urlArray = pathUrl.split('/');
    var lastTwoValues = urlArray[9]; 
    
    var recurso = new Recurso;
    recurso.carpeta_id = body.carpeta_id;
    recurso.nombre = body.nombre;
    recurso.imagen = lastTwoValues;
    
    await Recurso.create(recurso).then(RecursoDB => {
        res.json ({
            ok:true,
            recurso: RecursoDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner recursos
recursoRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ recurso, total] =  await Promise.all([
        Recurso.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    Recurso.countDocuments()
    ]);
    res.json({
        ok: true,
        recurso,
        total,
        id: req.id 
    });
});

// recursoRouter.get('/show', async (req, res) => {
//     try {
//       const desde = Number(req.query.desde) || 0;
//       const [herramientas, total] = await Promise.all([
//         Herramienta.find()
//           .sort({ _id: -1 })
//           .skip(desde)
//           .limit(5),
//         Herramienta.countDocuments(),
//       ]);
  
//       const categoriaIds = herramientas.map((h) => h.categoria_id);
//       const categorias = await Categoria.find({ _id: { $in: categoriaIds } });
  
//       const herramientasConNombreCategoria = herramientas.map((h) => {
//         const categoria = categorias.find((c) => c._id.equals(h.categoria_id));
//         return {
//           ...h.toObject(),
//           categoria: categoria ? categoria.nombre : null,
//         };
//       });
  
//       res.json({
//         ok: true,
//         herramienta: herramientasConNombreCategoria,
//         total,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error en el servidor' });
//     }
//   });



  
//Obetner 1 Herramienta por ID
recursoRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Recurso.find({carpeta_id:body.carpeta_id} , (err, RecursoDB) => {
        if( err ) throw err;
        if( RecursoDB ) {
            const recurso = RecursoDB;  //TRAE TODOS
            res.json({
                ok: true,
                recurso,
                mensaje: 'recurso encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'recurso no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Herramienta
recursoRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const herramienta = {
        categoria_id: req.body.categoria_id,
        nombre: req.body.nombre,
        imagen: req.body.imagen,
        enlace: req.body.enlace,
    }
    Herramienta.findByIdAndUpdate(id, herramienta, {new: true}, (err, herramienta) => {
        if(err) throw err;
        if(!herramienta){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            herramienta 
        })
    })
});


//Eliminar recurso
recursoRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const recurso = await Recurso.findById(id);
        if(!recurso) {
            return res.status(404).json({
                ok: true,
                msg: 'Recurso no encontrada por identificador'
            });
        }
        await Recurso.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Recurso eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
recursoRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Recurso.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  recursoRouter;
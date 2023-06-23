import { Router, Response, Request, response } from 'express';
import { Grado } from '../models/grado.model';
import { Unidad } from '../models/unidad.model';
import { CursoCapacitacion } from '../models/curso_capacitaciones.model';
import { Prueba } from '../models/prueba.model';
const unidadRouter = Router();


const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
})



//crear Unidad 
unidadRouter.post('/' , async  (req: any, res: Response ) => {
//     const body = req.body;
//     Unidad.create(body).then(UnidadDB => {
//         res.json ({
//             ok:true,
//             unidad: UnidadDB
//         });
//     }).catch( err => {
//         res.json(err)
//     });
// });

    const body = req.body;
    const   { tempFilePath  }   =  req.files.material;
    var resp = await cloudinary.uploader.upload( tempFilePath,{folder:"ramiro_app/unidades" ,public_id: `${Date.now()}`});
    const pathUrl = resp.secure_url;
    var urlArray = pathUrl.split('/');
    var lastTwoValues = urlArray[9]; 

    var unidad = new Unidad;
    unidad.id_capacitacion = body.id_capacitacion;
    unidad.nombre = body.nombre;
    unidad.video = body.video;
    unidad.tarea = body.tarea;
    unidad.tipo = body.tipo;
    unidad.meet = body.meet;
    unidad.material = lastTwoValues;

    await Unidad.create(unidad).then(UnidadDB => {
        res.json ({
            ok:true,
            unidad: UnidadDB
        });
    }).catch( err => {
        res.json(err)
    });
});






//Obetner Unidad
unidadRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ unidad, total] =  await Promise.all([
        Unidad.find()
                                    // .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    Unidad.countDocuments()
    ]);
    res.json({
        ok: true,
        unidad,
        total,
        id: req.id 
    });
});


//Obetner 1 Unidad por ID
unidadRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Unidad.find({_id:body._id} , (err, UnidadDB) => {
        
        if( err ) throw err;
        if( UnidadDB ) {
            const unidad = UnidadDB;  //TRAE TODOS
            res.json({
                ok: true,
                unidad,
                mensaje: 'Unidad encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Unidad no encontrado en nuestro sistema!'
            });
        }
    })
});



//Obetner 1 Unidad por ID
unidadRouter.post('/showByIDCapacitacion', async (req: any, res: any) => {
//     const body = req.body;
//     Unidad.find({id_capacitacion:body.id_capacitacion} , (err, UnidadDB) => {
//         if( err ) throw err;
//         if( UnidadDB ) {
//             const unidad = UnidadDB;  //TRAE TODOS
//             res.json({
//                 ok: true,
//                 unidad,
//                 mensaje: 'Unidad encontrado!!'
//             });
//         } else {
//             res.json({
//                 ok: false,
//                 mensaje: 'Unidad no encontrado en nuestro sistema!'
//             });
//         }
//     }) 
// });

try {
    const body = req.body;
    const desde = Number(req.query.desde) || 0;
    const [herramientas] = await Promise.all([
        Unidad.find({id_capacitacion:body.id_capacitacion} )
        // .sort({ _id: -1 })
        .skip(desde)
        // .limit(5),
        // Unidad.countDocuments(),
    ]);

    const capacitacionIds = herramientas.map((h) => h.id_capacitacion);
    // const tareaIds = herramientas.map((h) => h.tarea);
    const capacitaciones = await CursoCapacitacion.find({ _id: { $in: capacitacionIds } });
    // const tareas = await Prueba.find({ _id: { $in: tareaIds } });

    const herramientasConNombreCategoria = herramientas.map((h) => {
      const capacitacion = capacitaciones.find((c) => c._id.equals(h.id_capacitacion));
    //   const tarea = tareas.find((c) => c._id.equals(h.tarea));
      return {
        ...h.toObject(),
        id_capacitacion: capacitacion ? capacitacion.nombre : null,
        // tarea: tarea ? tarea.tituloPrueba : null,
      };
    });

    res.json({
      ok: true,
      unidad: herramientasConNombreCategoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



//Actualizar Unidad
unidadRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const unidad = {
        nombre: req.body.nombre,
        material: req.body.material,
        video: req.body.video,
        tarea: req.body.tarea,
        tipo: req.body.tipo,
        meet: req.body.meet,
    }
    Unidad.findByIdAndUpdate(id, unidad, {new: true}, (err, unidad) => {
        if(err) throw err;
        if(!unidad){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            unidad 
        })
    })
});


//Eliminar Unidad
unidadRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const unidad = await Unidad.findById(id);
        if(!unidad) {
            return res.status(404).json({
                ok: true,
                msg: 'Unidad no encontrada por identificador'
            });
        }
        await Unidad.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Unidad eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
unidadRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Unidad.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  unidadRouter;
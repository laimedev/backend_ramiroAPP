import { Router, Response, Request, response } from 'express';
import { CursoCapacitacion } from '../models/curso_capacitaciones.model';
const cursoCapacitacionRouter = Router();

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'laimedev',
    api_key: '514357759962521',
    api_secret: '1KGNTYZhwe_7TMXNLwvNR6SCWwQ'
})



//crear CursoCapacitacion 
cursoCapacitacionRouter.post('/' , async  (req: any, res: Response ) => {
    const body = req.body;
    const imagen = req.files.imagen; // Suponiendo que el campo se llama "imagen" en tu formulario
    const archivo = req.files.recursos; // Suponiendo que el campo se llama "archivo" en tu formulario
    // Subir la imagen a Cloudinary
    cloudinary.uploader.upload(imagen.tempFilePath, {folder:"ramiro_app/capacitacionesPortadas" ,public_id: `${Date.now()}`} , (error: any, result: any) => {
    const pathUrl = result.secure_url;
    var urlArray = pathUrl.split('/');
    var lastTwoValues = urlArray[9]; 
    if (error) {
      console.log('Error al subir la imagen:', error);
      return res.status(500).json({ error: 'Error al subir la imagen' });
    }
    // Aquí puedes hacer algo con el resultado de la subida de la imagen si lo deseas
    // console.log('Imagen subida correctamente:', result);
    // Subir el archivo a Cloudinary
    cloudinary.uploader.upload(archivo.tempFilePath, {folder:"ramiro_app/capacitaciones" ,public_id: `${Date.now()}`}, (error: any, result2: any) => {
    const pathUrl2 = result2.secure_url;
    var urlArray2 = pathUrl2.split('/');
    var lastTwoValues2 = urlArray2[9]; 
    if (error) {
    console.log('Error al subir el archivo:', error);
    return res.status(500).json({ error: 'Error al subir el archivo' });
    }
    // Aquí puedes hacer algo con el resultado de la subida del archivo si lo deseas
    //   console.log('Archivo subido correctamente:', result2);
    var capacitacion = new CursoCapacitacion;
    capacitacion.nombre = body.nombre;
    capacitacion.descripcion = body.descripcion;
    capacitacion.usuario_id = body.usuario_id;
    capacitacion.fecha_inicio = body.fecha_inicio;
    capacitacion.fecha_fin = body.fecha_fin;
    capacitacion.duracion = body.duracion;
    capacitacion.tipo = body.tipo;
    capacitacion.imagen = lastTwoValues;
    capacitacion.recursos = lastTwoValues2;
    CursoCapacitacion.create(capacitacion).then(CursoCapacitacionDB => {
        res.json ({
            ok:true,
            cursoCapacitacion: CursoCapacitacionDB
        });
    }).catch( err => {
        res.json(err)
    });
    // Devolver una respuesta al cliente
    //   return res.json({ imagen: result, archivo: result2 });
    });
  });
});




//Obetner CursoCapacitacion
cursoCapacitacionRouter.get('/show', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ cursoCapacitacion, total] =  await Promise.all([
        CursoCapacitacion.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 ),
                                    CursoCapacitacion.countDocuments()
    ]);
    res.json({
        ok: true,
        cursoCapacitacion,
        total,
        id: req.id 
    });
});


//Obetner 1 cursoCapacitacionRouter por ID
cursoCapacitacionRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    CursoCapacitacion.find({_id:body._id} , (err, CursoCapacitacionDB) => {
        if( err ) throw err;
        if( CursoCapacitacionDB ) {
            const cursoCapacitacion = CursoCapacitacionDB;  //TRAE TODOS
            res.json({
                ok: true,
                cursoCapacitacion,
                mensaje: 'CursoCapacitacion encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'CursoCapacitacion no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar cursoCapacitacionRouter
cursoCapacitacionRouter.post('/update/:id', (req: any, res: Response) => {
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
cursoCapacitacionRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const cursoCapacitacion = await CursoCapacitacion.findById(id);
        if(!cursoCapacitacion) {
            return res.status(404).json({
                ok: true,
                msg: 'CursoCapacitacion no encontrada por identificador'
            });
        }
        await CursoCapacitacion.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'CursoCapacitacion eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
cursoCapacitacionRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    CursoCapacitacion.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  cursoCapacitacionRouter;
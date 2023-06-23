import { Router, Response, Request, response } from 'express';
import { Resultado } from '../models/resultados.model';
import { Usuario } from '../models/usuario.model';
import { Prueba } from '../models/prueba.model copy';
import { Unidad } from '../models/unidad.model';
const resultadoRouter = Router();

//crear resultado 
resultadoRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Resultado.create(body).then(RepositorioDB => {
        res.json ({
            ok:true,
            resultado: RepositorioDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner resultado
resultadoRouter.get('/show', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;
//     const [ resultado, total] =  await Promise.all([
//                                     Resultado.find()
//                                     .sort({_id: -1})          
//                                     .skip( desde )
//                                     .limit( 5 ),
//                                     Resultado.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         resultado,
//         total,
//         id: req.id 
//     });
// });

try {
    const desde = Number(req.query.desde) || 0;

    const [resultados, total] = await Promise.all([
      Resultado.find()
        .sort({ _id: -1 })
        .skip(desde)
        .limit(10)
        .lean(),
        Resultado.countDocuments(),
    ]);

    const areaIds = resultados.map((resultado) => resultado.usuario_id);
    const adminIds = resultados.map((resultado) => resultado.capacitacion_id);

    const usuarios = await Usuario.find({ _id: { $in: areaIds } }, 'nombre').lean();
    const pruebas = await Unidad.find({ _id: { $in: adminIds } }, 'nombre').lean();

    const areaMap = usuarios.reduce((acc, usuario) => {
      acc[usuario._id] = usuario.nombre;
      return acc;
    }, {});

    const adminMap = pruebas.reduce((acc, prueba) => {
      acc[prueba._id] = prueba.nombre;
      return acc;
    }, {});

    const repositoriosConNombres = resultados.map((resultados) => ({
      ...resultados,
      usuario_id: areaMap[resultados.usuario_id] || null,
      capacitacion_id: adminMap[resultados.capacitacion_id] || null,
    }));

    res.json({
      ok: true,
      resultado: repositoriosConNombres,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


//Obetner 1 resultado por ID
resultadoRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Resultado.find({usuario_id:body.usuario_id} , (err, ResultadoDB) => {
        if( err ) throw err;
        if( ResultadoDB ) {
            const resultado = ResultadoDB;  //TRAE TODOS
            res.json({
                ok: true,
                resultado,
                mensaje: 'Resultado encontrado v2!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Resultado no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Resultado
resultadoRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const resultado = {
        usuario_id: req.body.usuario_id,
        capacitacion_id: req.body.nombre,
        nota: req.body.nota,
        observaciones: req.body.observaciones,
    }
    Resultado.findByIdAndUpdate(id, resultado, {new: true}, (err, resultado) => {
        if(err) throw err;
        if(!resultado){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            resultado 
        })
    })
});


//Eliminar repositorio
resultadoRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const resultado = await Resultado.findById(id);
        if(!resultado) {
            return res.status(404).json({
                ok: true,
                msg: 'Resultado no encontrada por identificador'
            });
        }
        await Resultado.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Resultado eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
resultadoRouter.post('/exportar', async (req: any, res: any) => {

    const body = req.body;


    try {

        const [resultados, total] = await Promise.all([
            Resultado.find({nombrePrueba:body.nombrePrueba} )
            .sort({ _id: -1 })
            .lean(),
            Resultado.countDocuments(),
        ]);

    const areaIds = resultados.map((resultado) => resultado.usuario_id);
    const adminIds = resultados.map((resultado) => resultado.capacitacion_id);

    const usuarios = await Usuario.find({ _id: { $in: areaIds } }, 'nombre').lean();
    const pruebas = await Unidad.find({ _id: { $in: adminIds } }, 'nombre').lean();

    const areaMap = usuarios.reduce((acc, usuario) => {
      acc[usuario._id] = usuario.nombre;
      return acc;
    }, {});

    const adminMap = pruebas.reduce((acc, prueba) => {
      acc[prueba._id] = prueba.nombre;
      return acc;
    }, {});

    const repositoriosConNombres = resultados.map((resultados) => ({
      ...resultados,
      usuario_id: areaMap[resultados.usuario_id] || null,
      capacitacion_id: adminMap[resultados.capacitacion_id] || null,
    }));

    res.json({
      ok: true,
      resultado: repositoriosConNombres,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



module.exports =  resultadoRouter;
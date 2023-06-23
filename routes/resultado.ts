import { Router, Response, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Resultado } from '../models/resultados.model';
import { Usuario } from "../models/usuario.model";
import { Unidad } from "../models/unidad.model";



const resultadoRoutes = Router();





//Crear RESULTADO
// resultadoRoutes.post('/', [verificaToken], (req: any, res: Response)=> {
       
//     const body = req.body;
//     body.usuario = req.usuario._id;

//     Resultado.create(body).then(async resultadoDB => {
//         await resultadoDB.populate('usuario').execPopulate();
//         res.json({
//             ok: true,
//             resultado: resultadoDB
//         });
//     }).catch(err => {
//         res.json(err)
//     });
// } );


resultadoRoutes.post('/' , (req: any, res: Response ) => {
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



//Obtener Resultados
resultadoRoutes.get('/',  async (req: any, res: Response)=> {

    let pagina = Number(req.query.pagina)  || 1;
    let skip =   pagina - 1;
    skip = skip * 10;

    const resultado = await Resultado.find()
                            .sort({_id: -1})
                            .skip( skip)
                            .limit(10)
                            .populate('usuario','-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        resultado
    });
});



//Obetner resultados x2
resultadoRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;

    const [ resultado, total] =  await Promise.all([
                                    Resultado.find()
                                    .sort({_id: -1})          
                                    .skip( desde )
                                    .limit( 5 )
                                    .populate('usuario','-password'),
                                    Resultado.countDocuments()
    ]);
    res.json({
        ok: true,
        resultado,
        total,
        id: req.id 
    });
});




//Obetner resultados TODOS
resultadoRoutes.post('/exportar', async (req: any, res: any) => {

    const body = req.body;


    try {

        const [resultados, total] = await Promise.all([
          Resultado.find({nombrePrueba:body.nombrePrueba} , ' -_id -pre1 -pre2')
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
    



//Eliminar prueba
resultadoRoutes.delete('/:id', async (req: any, res: any) => {
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




resultadoRoutes.post('/filtrar_resultado',  (req: any, res: Response ) => {
    const body = req.body;
    Resultado.find( {usuario:body.usuario} , (err, resultadoDB) => {
        if( err ) throw err;
        if( resultadoDB ) {
            const resultado = resultadoDB;  //TRAE TODOS
            res.json({
                ok: true,
                resultado,
                mensaje: 'Resultado del alumno encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Resultado del alumno no encontrado en nuestro sistema!'
            });
        }
    })
});

export default resultadoRoutes;
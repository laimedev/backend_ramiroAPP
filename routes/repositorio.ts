import { Router, Response, Request, response } from 'express';
import { Repositorio } from '../models/repositorio.model';
import { Area } from '../models/area.model';
import { Usuario } from '../models/usuario.model';
import { Admin } from '../models/admin.model';
const repositorioRouter = Router();

//crear repositorio 
repositorioRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Repositorio.create(body).then(RepositorioDB => {
        res.json ({
            ok:true,
            repositorio: RepositorioDB
        });
    }).catch( err => {
        res.json(err)
    });
});


//CODIGO MEJORADO 16
//Obetner repositorio
repositorioRouter.get('/show', async (req, res) => {
    try {
      const desde = Number(req.query.desde) || 0;
  
      const [repositorios, total] = await Promise.all([
        Repositorio.find()
          .sort({ _id: -1 })
          .skip(desde)
          .limit(5)
          .lean(),
        Repositorio.countDocuments(),
      ]);
  
      const areaIds = repositorios.map((repositorio) => repositorio.area_id);
      const adminIds = repositorios.map((repositorio) => repositorio.usuario_id);
  
      const areas = await Area.find({ _id: { $in: areaIds } }, 'nombre').lean();
      const admins = await Admin.find({ _id: { $in: adminIds } }, 'nombre').lean();
  
      const areaMap = areas.reduce((acc, area) => {
        acc[area._id] = area.nombre;
        return acc;
      }, {});

      const adminMap = admins.reduce((acc, admin) => {
        acc[admin._id] = admin.nombre;
        return acc;
      }, {});
  
      const repositoriosConNombres = repositorios.map((repositorio) => ({
        ...repositorio,
        area_id: areaMap[repositorio.area_id] || null,
        usuario_id: adminMap[repositorio.usuario_id] || null,
      }));
  
      res.json({
        ok: true,
        repositorio: repositoriosConNombres,
        total,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
// repositorioRouter.get('/show', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;
//     const [ repositorio, total] =  await Promise.all([
//                                     Repositorio.find()
//                                     .sort({_id: -1})          
//                                     .skip( desde )
//                                     .limit( 5 ),
//                                     Repositorio.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         repositorio,
//         total,
//         id: req.id 
//     });
// });


//Obetner 1 Vehiculo por ID
repositorioRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Repositorio.find({_id:body._id} , (err, RepositorioDB) => {
        if( err ) throw err;
        if( RepositorioDB ) {
            const repositorio = RepositorioDB;  //TRAE TODOS
            res.json({
                ok: true,
                repositorio,
                mensaje: 'Repositorio encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Repositorio no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Vehiculo
repositorioRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const repositorio = {
        usuario_id: req.body.usuario_id,
        nombre: req.body.nombre,
        placa: req.body.placa,
        carpeta_id: req.body.carpeta_id,
        area_id: req.body.area_id,
    }
    Repositorio.findByIdAndUpdate(id, repositorio, {new: true}, (err, repositorio) => {
        if(err) throw err;
        if(!repositorio){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            repositorio 
        })
    })
});


//Eliminar repositorio
repositorioRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const repositorio = await Repositorio.findById(id);
        if(!repositorio) {
            return res.status(404).json({
                ok: true,
                msg: 'Repositorio no encontrada por identificador'
            });
        }
        await Repositorio.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Repositorio eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
repositorioRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
                                    Repositorio.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  repositorioRouter;
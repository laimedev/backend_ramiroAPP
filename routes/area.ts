import { Router, Response, Request, response } from 'express';
import { Area } from '../models/area.model';
import { Grado } from '../models/grado.model';
const areaRouter = Router();

//crear Area 
areaRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Area.create(body).then(AreaDB => {
        res.json ({
            ok:true,
            area: AreaDB
        });
    }).catch( err => {
        res.json(err)
    });
});

//Obetner Area
areaRouter.get('/show', async (req, res) => {
    try {
      const desde = Number(req.query.desde) || 0;
  
      const [areas, total] = await Promise.all([
        Area.find()
          .sort({ _id: -1 })
          .skip(desde)
          .limit(5)
          .lean(),
        Area.countDocuments(),
      ]);
  
      const gradoIds = areas.map((a) => a.grado_id);
      const grados = await Grado.find({ _id: { $in: gradoIds } }).lean();
  
      const areasConNombreGrado = areas.map((a) => {
        const grado = grados.find((g) => g._id.equals(a.grado_id));
        return {
          ...a,
          grado: grado ? grado.nombre : null,
        };
      });
  
      res.json({
        ok: true,
        area: areasConNombreGrado,
        total,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

// areaRouter.get('/show', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;
//     const [ area, total] =  await Promise.all([
//         Area.find()
//                                     .sort({_id: -1})          
//                                     .skip( desde )
//                                     .limit( 5 ),
//                                     Area.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         area,
//         total,
//         id: req.id 
//     });
// });


//Obetner 1 Area por ID
areaRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Area.find({_id:body._id} , (err, AreaDB) => {
        if( err ) throw err;
        if( AreaDB ) {
            const area = AreaDB;  //TRAE TODOS
            res.json({
                ok: true,
                area,
                mensaje: 'Area encontrado!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Area no encontrado en nuestro sistema!'
            });
        }
    }) 
});


//Actualizar Area
areaRouter.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const area = {
        nombre: req.body.nombre,
        grado_id: req.body.grado_id,
    }
    Area.findByIdAndUpdate(id, area, {new: true}, (err, area) => {
        if(err) throw err;
        if(!area){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            area 
        })
    })
});


//Eliminar Area
areaRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const area = await Area.findById(id);
        if(!area) {
            return res.status(404).json({
                ok: true,
                msg: 'Area no encontrada por identificador'
            });
        }
        await Area.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Area eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});


//Exportar Excel
areaRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
        Area.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});


module.exports =  areaRouter;
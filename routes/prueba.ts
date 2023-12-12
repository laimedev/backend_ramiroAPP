import { Router, Response} from 'express';
const pruebaRouter = Router();
import { Prueba } from '../models/prueba.model';
import { CursoCapacitacion } from '../models/curso_capacitaciones.model';
import { Clasification } from '../models/clasification';






//crear prueba 
pruebaRouter.post('/' , (req: any, res: Response ) => {
    const body = req.body;
    Prueba.create(body).then(PruebaDB => {
        res.json ({
            ok:true,
            prueba: PruebaDB
        });
    }).catch( err => {
        res.json(err)
    });
});




//crear prueba 
pruebaRouter.post('/create/clasification' , (req: any, res: Response ) => {
    const body = req.body;
    Clasification.create(body).then(ClasificationDB => {
        res.json ({
            ok:true,
            clasification: ClasificationDB
        });
    }).catch( err => {
        res.json(err)
    });
});


//Obetner prueba
pruebaRouter.get('/clasification', async (req: any, res: any) => {
    const clasification = await Clasification.find()
    res.json({
        ok: true,
        clasification
    });
});




//Obetner reporte totales
pruebaRouter.get('/clasification/report', async (req, res) => {
    try {
        const clasifications = await Clasification.find();
        const reports: any = [];

        clasifications.forEach((item: any) => {
            let countNormal = 0;
            let countCaries = 0;

            item.result.forEach((resultItem: any) => {
                if (resultItem.label === 'Normal') {
                    countNormal++;
                } else if (resultItem.label === 'Caries') {
                    countCaries++;
                }
            });

            reports.push({
                _id: item._id,
                countNormal,
                countCaries,
                date: item.date,
                title: item.title,
                description: item.description,
                result: item.result
                // Agrega otros campos que desees incluir en el informe
            });
        });

        res.json(reports);
    } catch (error) {
        console.error('Error en la consulta a la base de datos:', error);
        res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
});




//Obetner prueba
pruebaRouter.get('/', async (req: any, res: any) => {
    const prueba = await Prueba.find()
                                .populate('admin','nombre img');
    res.json({
        ok: true,
        prueba
    });
});



//Obetner 1 Prueba por ID
pruebaRouter.post('/showByID', async (req: any, res: any) => {
    const body = req.body;
    Prueba.find({_id: body._id} , (err, PruebaDB) => {
        if( err ) throw err;
        if( PruebaDB ) {
            const prueba = PruebaDB;  //TRAE TODOS
            res.json({
                ok: true,
                prueba,
                mensaje: 'Prueba encontrado xd!!'
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Prueba no encontrado en nuestro sistema!'
            });
        }
    }) 
});




//Obetner prueba x2
pruebaRouter.get('/obtener', async (req: any, res: any) => {
//     const desde =  Number(req.query.desde) || 0;

//     const [ prueba, total] =  await Promise.all([
//                                     Prueba.find()
//                                     .sort({_id: -1})          
//                                     .skip( desde )
//                                     .limit( 5 ),
//                                     Prueba.countDocuments()
//     ]);
//     res.json({
//         ok: true,
//         prueba,
//         total,
//         id: req.id 
//     });
// });
try {
    const desde = Number(req.query.desde) || 0;
    const [herramientas,  total] = await Promise.all([
        Prueba.find()
        .sort({ _id: -1 })
        .skip(desde)
        .limit(5),
        Prueba.countDocuments(),
    ]);

    const capacitacionIds = herramientas.map((h) => h.id_capacitacion);
    const capacitaciones = await CursoCapacitacion.find({ _id: { $in: capacitacionIds } });

    const herramientasConNombreCategoria = herramientas.map((h) => {
      const capacitacion = capacitaciones.find((c) => c._id.equals(h.id_capacitacion));
      return {
        ...h.toObject(),
        id_capacitacion: capacitacion ? capacitacion.nombre : null,
      };
    });

    res.json({
      ok: true,
      prueba: herramientasConNombreCategoria,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});




//Actualizar prueba
pruebaRouter.post('/updatepre1/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre1: req.body.pre1        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});


//Actualizar prueba
pruebaRouter.post('/updatepre2/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre2: req.body.pre2        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre3/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre3: req.body.pre3      
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre4/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre4: req.body.pre4        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre5/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre5: req.body.pre5        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre6/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre6: req.body.pre6        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre7/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre7: req.body.pre7        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre8/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre8: req.body.pre8        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre9/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre9: req.body.pre9        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});

//Actualizar prueba
pruebaRouter.post('/updatepre10/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const prueba = {
        pre10: req.body.pre10        
    }
    Prueba.findByIdAndUpdate(id, prueba, {new: true}, (err, prueba) => {
        if(err) throw err;
        if(!prueba){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true, 
            prueba 
        })
    })
});


//Eliminar prueba
pruebaRouter.delete('/:id', async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const prueba = await Prueba.findById(id);
        if(!prueba) {
            return res.status(404).json({
                ok: true,
                msg: 'Prueba no encontrada por identificador'
            });
        }
        await Prueba.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'prueba eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});



//Exportar Excel
pruebaRouter.get('/exportar', async (req: any, res: any) => {
    const [ data ] =  await Promise.all([
        Prueba.find({})
                                    .sort({id: -1})    
    ]);
    res.json({
        ok: true,
        data,
    });
});



module.exports =  pruebaRouter;
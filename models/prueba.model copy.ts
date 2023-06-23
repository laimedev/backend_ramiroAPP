import { Schema, Document, model} from 'mongoose';

const pruebaSchema = new Schema({
    created: {
        type: Date
    },
    unidad_id: {
        type: String,
    },
    tituloPrueba: {
         type: String,
         required: true
    },
    descripcionPrueba: {
        type: String,
   },
    imagen: {
        type: String,
        default: 'assets/ramiroapp/examen.png'
    },
    pre1: {
        type: String
    },
    pre2: {
        type: String
    },
    pre3: {
        type: String
    },
    pre4: {
        type: String
    },
    pre5: {
        type: String
    },
    pre6: {
        type: String
    },
    pre7: {
        type: String
    },
    pre8: {
        type: String
    },
    pre9: {
        type: String
    },
    pre10: {
        type: String
    }
    
});




pruebaSchema.pre<IPrueba>('save', function( next ) {
    this.created = new Date();
    next();
});


interface IPrueba extends Document {
    created: Date,
    nombre: string;
    unidad_id: string;
    tituloPrueba: string;
    descripcionPrueba: string;
    imagen: string;
    pre1: string;
    pre2: string;
    pre3: string;
    pre4: string;
    pre5: string;
    pre6: string;
    pre7: string;
    pre8: string;
    pre9: string;
    pre10: string;
}



export const Prueba = model<IPrueba>('Prueba', pruebaSchema);
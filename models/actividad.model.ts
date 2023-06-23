import { Schema, Document, model} from 'mongoose';

const actividadSchema = new Schema({
    created: {
        type: Date
    },
    capacitacion_id: {
         type: String,
         required: true
    },
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    tiempo: {
        type: String,
    },
    calificacion: {
        type: String,
    }
});


actividadSchema.pre<IActividad>('save', function( next ) {
    this.created = new Date();
    next();
});


interface IActividad extends Document {
    created: Date;
    capacitacion_id: string;
    nombre: string;
    descripcion: string;
    tiempo: string;
    calificacion: string;
}


export const Actividad = model<IActividad>('Actividad', actividadSchema);
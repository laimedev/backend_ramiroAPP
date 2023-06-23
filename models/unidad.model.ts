import { Schema, Document, model} from 'mongoose';

const unidadSchema = new Schema({
    created: {
        type: Date
    },
    id_capacitacion: {
        type: String,
    },
    nombre: {
        type: String,
    },
    material: {
        type: String,
    },
    video: {
        type: String,
    },
    tarea: {
        type: String,
    },
    tipo: {
        type: String,
    },
    meet: {
        type: String,
    }
});

unidadSchema.pre<IUnidad>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IUnidad extends Document {
    created: Date,
    id_capacitacion: string;
    nombre: string;
    material: string;
    video: string;
    tarea: string;
    tipo: string;
    meet: string;
}

export const Unidad = model<IUnidad>('unidad', unidadSchema);

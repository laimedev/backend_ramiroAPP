import { Schema, Document, model} from 'mongoose';

const recursoSchema = new Schema({
    created: {
        type: Date
    },
    carpeta_id: {
        type: String,
    },
    nombre: {
         type: String,
    },
    imagen: {
        type: String,
   },
});

recursoSchema.pre<IRecurso>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IRecurso extends Document {
    created: Date,
    carpeta_id: string;
    nombre: string;
    imagen: string;
}

export const Recurso = model<IRecurso>('recurso', recursoSchema);
import { Schema, Document, model} from 'mongoose';

const carpetaSchema = new Schema({
    created: {
        type: Date
    },
    grado_id: {
        type: String,
    },
    area_id: {
        type: String,
    },
    repositorio_id: {
        type: String,
    },
    nota: {
         type: String,
    },
    observaciones: {
        type: String
    },
});

carpetaSchema.pre<ICarpeta>('save', function( next ) {
    this.created = new Date();
    next();
});

interface ICarpeta extends Document {
    created: Date,
    grado_id: string;
    area_id: string;
    repositorio_id: string;
    nota: string;
    observaciones: string;
}

export const Carpeta = model<ICarpeta>('carpeta', carpetaSchema);
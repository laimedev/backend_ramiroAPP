import { Schema, Document, model} from 'mongoose';

const gradoSchema = new Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String,
    }
});

gradoSchema.pre<IGrado>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IGrado extends Document {
    created: Date,
    nombre: string;
}

export const Grado = model<IGrado>('grado', gradoSchema);
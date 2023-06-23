import { Schema, Document, model} from 'mongoose';

const herramientaSchema = new Schema({
    created: {
        type: Date
    },
    categoria_id: {
        type: String,
        required: true
    },
    nombre: {
         type: String,
         required: true
    },
    descripcion: {
        type: String,
   },
    imagen: {
        type: String
    },
    enlace: {
        type: String
    },
});

herramientaSchema.pre<IHerramienta>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IHerramienta extends Document {
    created: Date,
    categoria_id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    enlace: string;
}

export const Herramienta = model<IHerramienta>('Herramienta', herramientaSchema);
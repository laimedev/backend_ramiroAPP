import { Schema, Document, model} from 'mongoose';

const categoriaHerramientaSchema = new Schema({
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
    imagen: {
        type: String
    },
    enlace: {
        type: String
    },
});

categoriaHerramientaSchema.pre<ICategoriaHerramienta>('save', function( next ) {
    this.created = new Date();
    next();
});

interface ICategoriaHerramienta extends Document {
    created: Date,
    categoria_id: string;
    nombre: string;
    imagen: string;
    enlace: string;
}

export const CategoriaHerramienta = model<ICategoriaHerramienta>('categoriaHerramienta', categoriaHerramientaSchema);
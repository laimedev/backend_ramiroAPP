import { Schema, Document, model} from 'mongoose';

const categoriaSchema = new Schema({
    created: {
        type: Date
    },
    codigo: {
        type: String,
        required: true
    },
    nombre: {
         type: String,
         required: true
    },
    // descripcion: {
    //     type: String
    // },
    // icono: {
    //     type: String
    // },
    // codigoSeccion: {
    //     type: String
    // }
});




categoriaSchema.pre<ICategoria>('save', function( next ) {
    this.created = new Date();
    next();
});


interface ICategoria extends Document {
    created: Date,
    codigo: string;
    nombre: string;
    // descipcion: string;
    // icono: string;
    // codigoSeccion: string;
}



export const Categoria = model<ICategoria>('Categoria', categoriaSchema);
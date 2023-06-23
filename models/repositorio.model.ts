import { Schema, Document, model} from 'mongoose';

const repositorioSchema = new Schema({
    created: {
        type: Date
    },
    usuario_id: {
        type: String,
        required: true
    },
    nombre: {
         type: String,
         required: true
    },
    area_id: {
        type: String
    },
});


repositorioSchema.pre<IRepositorio>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IRepositorio extends Document {
    created: Date,
    usuario_id: string;
    nombre: string;
    area_id: string;
}

export const Repositorio = model<IRepositorio>('repositorio', repositorioSchema);
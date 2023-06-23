import { Schema, Document, model} from 'mongoose';

const cursoCapacitacionSchema = new Schema({
    created: {
        type: Date
    },
    nombre: {
         type: String,
         required: true
    },
    usuario_id: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    fecha_inicio: {
        type: Date,
    },
    fecha_fin: {
        type: Date,
    },
    duracion: {
        type: Number,
    },
    imagen: {
        type: String,
    },
    tipo: {
        type: String,
    },
    recursos: {
        type: String,
    }
});


cursoCapacitacionSchema.pre<ICursoCapacitacion>('save', function( next ) {
    this.created = new Date();
    next();
});


interface ICursoCapacitacion extends Document {
    created: Date;
    nombre: string;
    usuario_id: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    duracion: string;
    imagen: string;
    tipo: string;
    recursos: string;
}



export const CursoCapacitacion = model<ICursoCapacitacion>('CursoCapacitacion', cursoCapacitacionSchema);
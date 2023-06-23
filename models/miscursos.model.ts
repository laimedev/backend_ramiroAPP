import { Schema, Document, model} from 'mongoose';

const misCursosSchema = new Schema({
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
    id_capacitacion: {
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


misCursosSchema.pre<IMisCursos>('save', function( next ) {
    this.created = new Date();
    next();
});


interface IMisCursos extends Document {
    created: Date;
    nombre: string;
    usuario_id: string;
    id_capacitacion: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    duracion: string;
    imagen: string;
    tipo: string;
    recursos: string;
}



export const MisCursos = model<IMisCursos>('MisCursos', misCursosSchema);
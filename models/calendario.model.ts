import { Schema, Document, model} from 'mongoose';

const calendarioSchema = new Schema({
    created: {
        type: Date
    },
    usuario_id: {
        type: String,
    },
    titulo: {
        type: String,
    },
    detalles: {
         type: String,
    },
});

calendarioSchema.pre<ICalendario>('save', function( next ) {
    this.created = new Date();
    next();
});

interface ICalendario extends Document {
    created: Date,
    usuario_id: string;
    titulo: string;
    detalles: string;
}

export const Calendario = model<ICalendario>('calendario', calendarioSchema);
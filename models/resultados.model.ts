import { Schema, Document, model} from 'mongoose';

const resultadosSchema = new Schema ({

    created: {
        type: Date
    },
    capacitacion_id: {
        type: String
    },
    nombrePrueba: {
        type: String
    },
    nota: {
        type: String
    },
    observaciones: {
        type: String
    },
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referencia a un usuario']
    },
    nombreUsuario: {
        type: String
    }
});

resultadosSchema.pre<IResultado>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IResultado extends Document {
    created: Date;
    capacitacion_id: string;
    nota: string;
    observaciones: string;
    usuario_id: string;
    nombrePrueba: string;
    nombreUsuario: string;
}

export const Resultado = model<IResultado>('Resultado', resultadosSchema);
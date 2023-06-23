import { Schema, Document, model} from 'mongoose';

const asistenciaSchema = new Schema ({

    created: {
        type: Date
    },
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});

asistenciaSchema.pre<IAsistencia>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IAsistencia extends Document {
    created: Date;
    usuario_id: string;
}

export const Asistencia = model<IAsistencia>('Asistencia', asistenciaSchema);
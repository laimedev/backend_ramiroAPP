import { Schema, Document, model} from 'mongoose';

const areaSchema = new Schema({
    created: {
        type: Date
    },
    grado_id: {
        type: String,
    },
    nombre: {
        type: String,
    },
});

areaSchema.pre<IArea>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IArea extends Document {
    created: Date,
    grado_id: string;
    nombre: string;
}

export const Area = model<IArea>('area', areaSchema);
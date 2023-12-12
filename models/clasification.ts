import { Schema, Document, model} from 'mongoose';

const clasificationSchema = new Schema({
    created: {
        type: Date
    },
    date: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
         type: String,
         required: true
    },
    result: {
        type: Array,
        default: []
   }
});




clasificationSchema.pre<IClasification>('save', function( next ) {
    this.created = new Date();
    next();
});


interface IClasification extends Document {
    created: Date,
    date: string;
    title: string;
    description: string;
    result: any;
}



export const Clasification = model<IClasification>('Clasification', clasificationSchema);
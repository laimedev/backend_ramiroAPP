import { Schema, Document, model} from 'mongoose';

const AdminSchema = new Schema({
    nombre: {
         type: String,
         required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    password_show: {
        type: String,
        item: null
    },
    img: {
        type: String,
        default: 'default.png'
        
    },
    role: {
        type: String,
        required: true,
        default: '2'
    },
});




AdminSchema.method('toJSON', function() {
    const {__v, _id, password,...Object } = this.toObject();
    Object.id = _id;
    return Object;
})



interface IAdmin extends Document {
    nombre: string;
    email: string;
    role: string;
    password: string;
    password_show: string;
}


export const Admin = model<IAdmin>('Admin', AdminSchema);
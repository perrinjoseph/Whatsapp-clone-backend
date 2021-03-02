import mongoose from 'mongoose';

const whatsappSchema = new mongoose.Schema({
    message: String,
    name:String,
    timestamp: String,
    received: Boolean,
})

const whatsappModel = mongoose.model('messages',whatsappSchema)
export default whatsappModel;
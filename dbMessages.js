const mongoose = require('mongoose')


const whatsappSchema = new mongoose.Schema({
    message: String,
    name:String,
    timestamp: String,
    received: Boolean,
})

const whatsappModel = mongoose.model('messages',whatsappSchema)
module.exports= whatsappModel;
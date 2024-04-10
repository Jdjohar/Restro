const mongoose = require('mongoose');
const {Schema} = mongoose;

const ServiceSchema = new Schema({
    name:{
        type: String,
    },
    price: {
        type: String,
    },
    time: {
        type: String,
    },
    isAvailable: { 
        type: Boolean, 
        default: false 
    },
    imageUrl: {
        type: String,
        required: true
    },
    userid:{
        type: String,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business', 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('services',ServiceSchema)
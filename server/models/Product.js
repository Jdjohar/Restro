const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    name:{
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: String,
    },
    size: {
        type: String,
    },
    colour : {
        type: String,
    },
    quantity: {
        type: Number,
    },
    isAvailable: { 
        type: Boolean, 
        default: false 
    },
    userid:{
        type: String,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store', 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('product',ProductSchema)
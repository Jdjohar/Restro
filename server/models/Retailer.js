const mongoose = require('mongoose');
const {Schema} = mongoose;

const RetailerSchema = new Schema({
    name:{
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    size: {
        type: String,
        // required: true
    },
    colour : {
        type: String,
        // required: true
    },
    quantity: {
        type: Number,
        // required: true
    },
    userid:{
        type: String,
        // required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('retailer',RetailerSchema)
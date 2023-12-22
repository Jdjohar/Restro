const mongoose = require('mongoose');
const {Schema} = mongoose;

const CategorySchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
    },
    name:{
        type: String,
    },
    userid:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('category',CategorySchema)
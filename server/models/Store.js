const mongoose = require('mongoose');
const {Schema} = mongoose;

const StoreSchema = new Schema({
    name:{
        type: String,
    },
    nickname:{
        type: String,
    },
    type:{
        type: String,
    },
    email:{
        type: String,
        required: true
    },
    number:{
        type: String,
    },
    country:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    city:{
        type: String,
    },
    countryid:{
        type: Number,
        required: true
    },
    stateid:{
        type: Number,
    },
    cityid:{
        type: Number,
    },
    countrydata:{
        type: String,
    },
    statedata:{
        type: String,
    },
    citydata:{
        type: String,
    },
    zip:{
        type: String,
    },
    address:{
        type: String,
        required: true
    },
    userid:{
        type: String,
    },
    timezone: {
        type: String, 
      },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('store',StoreSchema)
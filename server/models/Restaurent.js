const mongoose = require('mongoose');
const {Schema} = mongoose;

const RestaurentSchema = new Schema({
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
    },
    number:{
        type: String,
    },
    country:{
        type: String,
    },
    state:{
        type: String,
    },
    city:{
        type: String,
    },
    countryid:{
        type: Number,
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

module.exports = mongoose.model('restaurent',RestaurentSchema)
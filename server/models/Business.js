const mongoose = require('mongoose');
const {Schema} = mongoose;

const BusinessSchema = new Schema({
    name:{
        type: String,
        // required: true
    },
    nickname:{
        type: String,
        // required: true
    },
    type:{
        type: String,
        // required: true
    },
    email:{
        type: String,
        // required: true
    },
    number:{
        type: String,
        // required: true
    },
    country:{
        type: String,
        // required: true
    },
    state:{
        type: String,
        // required: true
    },
    city:{
        type: String,
        // required: true
    },
    countryid:{
        type: Number,
        // required: true
    },
    stateid:{
        type: Number,
        // required: true
    },
    cityid:{
        type: Number,
        // required: true
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
        // required: true
    },
    address:{
        type: String,
        // required: true
    },
    userid:{
        type: String,
        // required: true
    },
    timezone: {
        type: String, 
        // required: true,
      },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('business',BusinessSchema)
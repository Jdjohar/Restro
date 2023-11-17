const mongoose = require('mongoose');
const {Schema} = mongoose;

const BusinessPreferenceSchema = new Schema({
    businessId: {
        type: String,
    },
    userid:{
        type: String,
    },
    backgroundColor: String,
    textColor: String,
    headingTextColor: String,
    businessnameColor: String,
    font: String,
    fontlink: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BusinessPreference',BusinessPreferenceSchema)
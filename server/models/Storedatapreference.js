const mongoose = require('mongoose');
const {Schema} = mongoose;

const StorePreferenceSchema = new Schema({
    storeId: {
        type: String,
    },
    userid:{
        type: String,
    },
    backgroundColor: String,
    backgroundImage: String,
    textColor: String,
    headingTextColor: String,
    storenameColor: String,
    font: String,
    fontlink: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StorePreference',StorePreferenceSchema)
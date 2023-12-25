const mongoose = require('mongoose');
const {Schema} = mongoose;

const WeeklyOfferSchema = new Schema({
    offerName: {
        type: String,
    },
    userid: {
        type: String,
    },
    restaurantId: {
      type: String, 
    },
    storeId: {
      type: String, 
    },
    businessId: {
      type: String, 
    },
    price: {
        type: String,
    },
    switchState: {
      type: Boolean,
      default: false, // Set the default value as false
    },

    startTime: String,

    endTime: String,

    startDate: Date, 
    
    endDate: Date,

    createdAt: {
        type: Date,
        default: Date.now 
    },
    
    selectedDays: [{
        type: String,
    }],
    searchResults: [{ label: String, value: String }],

})

module.exports = mongoose.model('WeeklyOffer',WeeklyOfferSchema)
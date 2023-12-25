const mongoose = require('mongoose');
const {Schema} = mongoose;

const OfferSchema = new Schema({
    offerName: {
        type: String,
    },
    customtxt: {
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
    switchState: {
      type: Boolean,
      default: false, 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    
    searchResults: [{ label: String, value: String }],

})

module.exports = mongoose.model('Offer',OfferSchema)
const mongoose = require('mongoose');
const {Schema} = mongoose;

const TemplateSchema = new mongoose.Schema({
    jsonData: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  

module.exports = mongoose.model('Template',TemplateSchema)
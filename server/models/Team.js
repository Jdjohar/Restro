const mongoose = require('mongoose');
const {Schema} = mongoose;

const TeamSchema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    number:{
        type: String,
    },
    userid:{
        type: String,
    },
    signuptype:{
        type:String,
    },
    password:{
        type:String,
    },
    isTeammember: {
      type: Boolean,
      default: false,
    },
  
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Team',TeamSchema)
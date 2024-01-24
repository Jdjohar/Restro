const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
    },
    location:{
        type:String,
    },
    signuptype:{
        type:String,
    },
    email:{
        type: String,
    },
    password:{
        type:String,
    },
    signupMethod:{
        type:String,
    },
    isTeammember: {
      type: Boolean,
      default: false,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user',UserSchema)
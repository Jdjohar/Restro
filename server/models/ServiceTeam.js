const mongoose = require('mongoose');
const {Schema} = mongoose;

const ServiceTeamSchema = new Schema({
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
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Serviceteam',ServiceTeamSchema)
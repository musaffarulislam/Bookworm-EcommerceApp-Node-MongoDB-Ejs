const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const userScheme = new Scheme({
    username : String,
    email : {
        type : String,
        require : true,
        unique : true,
    },
    phoneNumber : Number,
    age : Number,
    password : String,
    block : Boolean,
});

const user = mongoose.model('user', userScheme);

module.exports = user;
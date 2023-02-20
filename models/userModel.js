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
    userImage : String,
    address :  {
                type: [
                    {
                        houseName: String,
                        streetName: String,
                        town: String,
                        state: String,
                        country: String,
                        zipCode: String,
                    }
                ],
                default : {
                    address : false
                }
            },
    block : Boolean,
});

const user = mongoose.model('user', userScheme);

module.exports = user;
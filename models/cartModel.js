const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const cartScheme = new Scheme({
    user : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'user'
    },
    product : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'book'
    },
    quantity : {
        type : Number,
        default : 1
    },
});

const cart = mongoose.model('cart', cartScheme);

module.exports = cart;
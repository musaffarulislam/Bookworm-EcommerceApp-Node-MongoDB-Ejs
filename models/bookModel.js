const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const bookScheme = new Scheme({
    bookName : {
        type : String,
        required : true
    },
    bookDetails : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'authors'
    },
    category : {
        type : String,
        required : true
    },
    pages : {
        type : Number,
        required : true
    },
    retailPrize : {
        type : Number,
        required : true
    },
    rendPrize : {
        type : Number,
        required : true
    },
});

const book = mongoose.model('book', bookScheme);

module.exports = book;
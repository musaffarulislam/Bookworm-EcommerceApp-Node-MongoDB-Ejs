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
        ref : 'author'
    },
    genre : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'genre'
    },
    image1 : {
        type : String,
        required : true
    },
    image2 : {
        type : String,
        required : true
    },
    image3 : {
        type : String,
        required : true
    },
    pages : {
        type : Number,
        required : true
    },
    retailPrice : {
        type : Number,
        required : true
    },
    rentPrice : {
        type : Number,
        required : true
    },
    delete : Boolean,
});

const book = mongoose.model('book', bookScheme);

module.exports = book;
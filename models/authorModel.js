const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const authorScheme = new Scheme({
    authorName : String,
    authorDetails : String,
    delete : Boolean,
})

const author = mongoose.model('author', authorScheme);

module.exports = author;
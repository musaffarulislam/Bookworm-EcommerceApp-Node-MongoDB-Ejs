const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const authorScheme = new Scheme({
    authorName : String,
    authorDetails : String,
    authorImage : {
        type: String,
        default: "../books/book-authorImage-1675596685094.jpeg"
    },
    delete : Boolean,
})

const author = mongoose.model('author', authorScheme);

module.exports = author;
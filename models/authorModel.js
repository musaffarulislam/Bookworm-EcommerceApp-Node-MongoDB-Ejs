const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const authorSchema = new Scheme({
    authorName : String,
    authorDetails : String,
    authorImage : String,
    delete : Boolean,
})

const author = mongoose.model('author', authorSchema);

module.exports = author;
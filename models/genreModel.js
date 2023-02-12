const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const genreSchema = new Scheme({
    genreName : String,
    delete : Boolean,
})

const genre = mongoose.model('genre', genreSchema);

module.exports = genre;
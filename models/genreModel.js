const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const genreScheme = new Scheme({
    genreName : String,
    delete : Boolean,
})

const genre = mongoose.model('genre', genreScheme);

module.exports = genre;
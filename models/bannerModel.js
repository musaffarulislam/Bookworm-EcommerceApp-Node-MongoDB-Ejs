const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const bannerScheme = new Scheme({
    colorPalatte : {
        type: String,
        required : true
    },
    mainHeading : {
        type : String,
        required : true
    },
    subHeading1 : {
        type : String,
        required : true
    },
    subHeading2 : {
        type : String,
        required : true
    },
    homeImage : {
        type : String,
        required : true
    },
    bigCardHeading1 : {
        type : String,
        required : true
    },
    bigCardHeading2 : {
        type : String,
        required : true
    },
    bigCardDiscription : {
        type : String,
        required : true
    },
    bigCardProductId : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true
    },
    bottomImage1 : {
        type : String,
        required : true
    },
    bottomImage2 : {
        type : String,
        required : true
    },
});

const banner = mongoose.model('banner', bannerScheme);

module.exports = banner;
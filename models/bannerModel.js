const mongoose = require('mongoose');
const Scheme = mongoose.Schema
const bannerScheme = new Scheme({
    banner: {
        type: Boolean,
        default: true,
    },
    colorPalatte : {
        type: String
    },
    mainHeading : {
        type : String
    },
    subHeading1 : {
        type : String
    },
    subHeading2 : {
        type : String
    },
    homeImage : {
        type : String
    },
    bigCard1Heading1 : {
        type : String
    },
    bigCard1Heading2 : {
        type : String
    },
    bigCard1Discription : {
        type : String
    },
    bigCard1ProductId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'book'
    },
    bigCard1Image : {
        type : String
    },
    bigCard2Heading1 : {
        type : String
    },
    bigCard2Heading2 : {
        type : String
    },
    bigCard2Discription : {
        type : String
    },
    bigCard2ProductId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'book'
    },
    bigCard2Image : {
        type : String
    },
    bottomImage1 : {
        type : String
    },
    bottomImage2 : {
        type : String
    },
});

const banner = mongoose.model('banner', bannerScheme);

module.exports = banner;
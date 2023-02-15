const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  couponName: {
    type: String,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  maximumDiscountPrice: {
    type: Number,
    required: true
  },
  minimumTotal: {
    type: Number,
    required: true
  },
  ExpiredDate: {
    type: String,
    required: true
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ]
});


const coupon = mongoose.model('coupon', couponSchema);

module.exports = coupon;
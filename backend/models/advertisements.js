// backend/models/Advertisement.js
const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  name:String,
   email:String,
   phone:String,
   description:String,
  adverCompanyName: {
    type: String,
    required: true,
  },
  AdImgUrl: {
    type: String,
    required: true,
  },
  companyLink: {
    type: String,
    required: true,
  },
  noOfClicks: {
    type: Number,
    default: 0,
  },
  impreessions:{type : Number, default:0},
  clicks:[{
    timestamp: { type: Date, default: Date.now },
    clickedby:String, // "desktop", "mobile", "tablet"
  }],
  weight: {
    type: Number, 
    default: 1, 
    required: false, 
  },
});

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
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
  price:Number,

});

module.exports = mongoose.model('Advertisement_Requests', AdvertisementSchema);
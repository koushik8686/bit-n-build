const mongoose = require('mongoose')

const reviewschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    organization:String,
    about:String,
    reviews:[{id:String}],    
    grantsreviews:[{id:String}],    
    scaleup:[{id:String}]    
})

const Review = mongoose.model('Reviewers', reviewschema)

module.exports = Review
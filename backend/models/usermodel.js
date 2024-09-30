const mongoose = require('mongoose')
const {startupSchema} = require("./startupmodel")

const userschema = mongoose.Schema({
    username : String , 
    password : String , 
    email:String,
    startup : String
}, {
    timestamps: true // {{ edit_1 }}: Enable timestamps
})

const usermodel = mongoose.model("user" , userschema)
module.exports =usermodel
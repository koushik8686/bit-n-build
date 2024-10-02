const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    startup_id:String,
    messsages:[{
      message:String,
      sender:String,
      created_at: { type: Date, default: Date.now }
    }]
})

const messageModel = mongoose.model("admin_messages",messageSchema)
module.exports = messageModel
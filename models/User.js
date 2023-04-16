const mongoose = require("mongoose")


const Schema = mongoose.Schema


const User = new Schema({
    fullname : {
        type:String,
        required: true
    },
    email : {
        type:String
    },
    password : {
        type:String
    }
})


const userModel = mongoose.model("user",User)

module.exports = userModel
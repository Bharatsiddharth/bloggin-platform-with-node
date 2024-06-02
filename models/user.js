const mongoose = require('mongoose');

const  plm = require("passport-local-mongoose")

const userSchema = mongoose.Schema({
    profilepic:{
        type:String,
        default: "default.png",
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

    password:String



})

userSchema.plugin(plm)


const user = mongoose.model("user", userSchema);

module.exports = user;



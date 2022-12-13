//const mongoose = require("../database");
var mongoose = require('mongoose');

// create an schema
var userSchema = new mongoose.Schema({

            name: String,

            password: String,

            email:String

        }, {timestamps: true});


//var userModel=mongoose.model('users',userSchema);
mongoose.model('User', userSchema);

//module.exports = mongoose.model("Users", userModel);
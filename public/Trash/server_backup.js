const express = require("express");
const app = express();
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/userModel");

var path = require('path')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require("express-session") ({
    secret: "node js mongodb",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs')

mongoose.connect("mongodb+srv://cdaidone:4RMb0merkMaqs0Et@cluster0.rdjhtko.mongodb.net/tryl", {useNewUrlParser: true}, {useUnifiedTopology: true})

//Tryl data schema
const trylSchema = {
    companyname: String,
    trialduration: Number,
    trialexpiration: Date,
}

const Tryl = mongoose.model("Tryl", trylSchema);

app.get("/", function(req, res) {
    Tryl.find({}, function(err, tryls) {
        res.render('index', {
          trialList: tryls
        })
    })
})

app.post("/", function(req, res) {
    let newTryl = new Tryl({
        companyname: req.body.companyname,
        trialduration: req.body.trialduration,
        trialexpiration: req.body.trialexpiration
    });
    newTryl.save();
    res.redirect('/');
})

app.listen(3000, function() {
    console.log("server is running on 3000");
})
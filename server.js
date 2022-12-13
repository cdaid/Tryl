//Creates app server
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const connectEnsureLogin = require('connect-ensure-login');
const path = require('path');
const ejs = require('ejs');
const mongoose = require("mongoose");
const morgan = require('morgan')
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { MongoTopologyClosedError } = require("mongodb");
const flash = require('connect-flash');
const session = require ('express-session');
const MongoStore = require('connect-mongo');
const moment = require('moment');
const { isDate } = require("moment");

//Initializes app variable with Express
const app = express();

const db = require('./config/keys').MongoURI;

// NEW Connect to MongoDB Database
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//EJS Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


// Bodyparser
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware
app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://cdaidone:4RMb0merkMaqs0Et@cluster0.rdjhtko.mongodb.net/tryl'})
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Connect Flash
app.use(flash());

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Tryl data schema
const trylSchema = {
    companyname: String,
    trialduration: Number,
    trialexpiration: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
};

const Tryl = mongoose.model("Tryl", trylSchema);

app.get("/", function(req, res) {
    Tryl.find({}, function(err, tryls) {
        res.render('index', {
          trialList: tryls,
          moment: moment
        })
    })
});

app.post("/", function(req, res) {
    let newTryl = new Tryl({
        companyname: req.body.companyname,
        trialduration: req.body.trialduration,
        trialexpiration: req.body.trialexpiration
    });
    newTryl.save();
    res.redirect('/');
});

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.get('/home', (req, res) => {
    res.render("home", {title: "Home"});
});

app.get('/index', (req, res) => {
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/login', (req, res) => {
    res.render("login");
});
app.get('/', (req, res) => {
    res.render("index");
});

app.use('/', require('./routes/index2'));

app.use('/users', require('./routes/users'));

app.listen(3000, () => {
	console.log("Listening on port 3000");
});

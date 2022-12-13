const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

// User Model
const User = require('../models/User');
const { request } = require('express');
const { forwardAuthenticated } = require('../config/auth');

//Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

//Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check requried fields
    if (!name || ! email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //Check password match
    if(password  !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    //Password Character Check
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation Pass
        User.findOne({ email: email})
            .then(user => {
                if(user) {
                    //User exists
                    errors.push({ msg: 'Email already exists'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //set password to hashed
                            newUser.password = hash;
                            // Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('succes_msg', 'You are now registered and can login');
                                    res.redirect('/users/login');
                                })
                                .catch( err => console.log(err));

                    });
                });
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {return next(err); }
        req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
    });
});


module.exports = router;


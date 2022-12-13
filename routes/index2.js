const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');
// Home Page
router.get('/home', forwardAuthenticated, (req, res) => res.render('home'));

// App
router.get('/index', ensureAuthenticated, async (req, res) => {
    res.render('index', {
        name: req.user.name
    });
});

module.exports = router;
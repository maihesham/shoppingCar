var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../model/order');
var csrfProtection = csrf();
var Cart = require('../model/cart');

router.use(csrfProtection);

router.get('/userprofile', isLoggedIn, function (req, res, next) {
     Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart.items);
            order.items = cart.generateArray();
        });
        res.render('user/userprofile', {title: 'userProfile', orders: orders });
    });
 });

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.session.delete;
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
   next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {title: 'signup',csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/signin',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin',function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {title: 'signin',csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/userprofile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
        console.log();

    if (req.isAuthenticated()&&req.session.user.role=="user") {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
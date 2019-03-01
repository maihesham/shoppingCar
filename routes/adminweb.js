var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var pr=require("../model/addproduct")
var passport = require('passport');
var csrfProtection = csrf();
router.use(csrfProtection);
router.get('/signinasAdmin',INloginASanyUser, function (req, res, next) {
	console.log("from here ");
	var messages = req.flash('error');
    res.render('adminweb/signinasAdmin', {title: 'signinasAdmin',csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})});
router.post('/signinasAdmin', passport.authenticate('local.signinASadmin', {
    successRedirect: '/adminweb/adminProfile',
    failureRedirect: '/adminweb/signinasAdmin',
    failureFlash: true
}));
router.get('/adminProfile', isLoggedIn,function (req, res, next) {
	console.log("from here admin Profile");
    res.render('adminweb/adminProfile', {title: 'adminProfile',csrfToken: req.csrfToken()})});
router.post('/adminProfile', function(req, res, next) {
   pr.addproduct(req);
   res.redirect("/adminweb/adminProfile");
});

module.exports = router;
function INloginASanyUser(req,res,next){
    if(req.session.user){
         res.redirect('/');
    }else{
        next();
    }
}
function isLoggedIn(req, res, next) {
    console.log(req.session.user.role);
    if (req.session.user.role==="admin") {
        return next();
    }else{
         res.redirect('/');
    }
   
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
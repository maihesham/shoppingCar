var passport = require('passport');
var User = require('../model/user'); 
var Admin=require('../model/admin'); 
var LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
}, function (req, email, pass, done) {
  
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'email is already in use.'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(pass);
        newUser.save(function(err, result) {
           if (err) {
               return done(err);
           }
           return done(null, newUser);
        });
    });
}));
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
}, function(req, email, pass, done) {
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(pass)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        if(req.session.user){
            req.session.user=null;
        }
        req.session.user=user;
        return done(null, user);
    });
}));
passport.use('local.signinASadmin', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
}, function(req, email, pass, done) {
     console.log("before                    "+req.session.user);
    Admin.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(pass)) {
            return done(null, false, {message: 'Wrong password.'});
        }
         if(req.session.user){
            req.session.user=null;
        }
         req.session.user=user;
        return done(null, user);
    });
}));
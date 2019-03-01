var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var adminwebRoutes = require('./routes/adminweb');
var app = express();
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());

app.use(cookieParser());
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
   req.session.cookie.maxAge = 180 * 60 * 1000; // 3 hours
    next();
});
app.use(function(req, res, next) {
   res.locals.login = req.isAuthenticated(); // global vairable used to check if user is login can use in header to change it base on user state
    res.locals.session = req.session;//all can acces my session
   // res.locals.userType=req.session.user.role;
    res.locals.isadd1=0;
    next();
});
app.use('/adminweb',adminwebRoutes);
app.use('/user', userRoutes);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
       next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

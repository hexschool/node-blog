var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var flash = require('connect-flash');
var session = require('express-session');
var index = require('./routes/index');
var dashboard = require('./routes/dashboard');
var auth = require('./routes/auth');
require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('express-ejs-extend')); // express-ejs-extend 
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'mysupersecret', resave: false, saveUninitialized: false }));
app.use(flash());

const authChecker = (req, res, next) => {
  console.log('middleware', req.session);
  if (req.session.uid === process.env.ADMIN_UID) {
    return next();
  }
  return res.redirect('/auth/signin');
}

app.use('/auth', auth);
app.use('/', index);
app.use('/dashboard', authChecker, dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

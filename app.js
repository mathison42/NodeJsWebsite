var express  = require('express');
var exphbs   = require('express-handlebars');
var hbs      = require('handlebars');
var flash    = require('connect-flash');
var favicon  = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var path     = require('path');

var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var MemcachedStore = require('connect-memcached')(session);

// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration
var configDB = require('./config/database'); // get MongoDB database configuration
var auth     = require('./config/auth'); // get general authentication configuration

var app = express();

// Helper Functions
var helpers = require("./public/javascripts/helpers");
var lifts  = require("./public/javascripts/lifts");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//https://github.com/ericf/express-handlebars
app.engine('hbs', exphbs({defaultLayout:'layout', helpers: helpers}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// Configure the session and session storage.
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: auth.secret,
  signed: true
};

// In production use the App Engine Memcache instance to store session data,
// otherwise fallback to the default MemoryStore in development.
if (!auth.googleAuth.callbackURL.includes("localhost")) {
  sessionConfig.store = new MemcachedStore({
    hosts: [auth.memcache_url]
  });
}

// required for passport
app.use(session(sessionConfig)); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

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

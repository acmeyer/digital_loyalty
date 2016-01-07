if (process.env.NODE_ENV !== 'production'){
  var dotenv = require('dotenv');
  dotenv.load();
}
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var mongoose = require('mongoose');
var morgan = require('morgan');
var Colu = require('colu');
if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

var app = express();

var auth = require('./controllers/auth.js');

// Database
mongoose.connect(process.env.MONGOLAB_URI, function(err, db) {
  if (err) return console.log(err)
});

// App
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Headers
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Routes
// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/api/v1/*', auth.validate);
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Colu engine setup
var settings = {
    network: process.env.COLU_NETWORK,
    apiKey: process.env.COLU_KEY,
    privateSeed: process.env.COLU_PRIVATE_SEED
}
colu = new Colu(settings)
if (process.env.NODE_ENV !== 'production'){
  colu.on('connect', function () {
    console.log('connected to colu')
    console.log(colu.hdwallet.getPrivateSeed())
  });
}
colu.init()


// Error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

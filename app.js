const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const http = require('http')

const PORT = 3000;

// MongoDB
const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'dbname'

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Mongo connected successfully to server.");
    client.close();
});

// Mongoose
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/dbname', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongoose connected successfully to server.");
});

const app = express();

// helmet header protection
//app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
    

// configure passport
app.set('trust proxy', 1);
app.use(session({secret:'myTopSecretKey',
    saveUninitialized: true,
    resave: true}));
app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
const initPassport = require('./passport/init');
initPassport(passport);



const routes = require('./routes/index.js')(passport);

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

const httpPortalServer = http.createServer(app);
httpPortalServer.listen(PORT, function(){
    console.log("Node portal server running.");
});

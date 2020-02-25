var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//8.11.2017
var fs = require('fs');
var cors = require('cors');

// Mongoose.js to 'require' and call connection to MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/*
mongoose.connect('mongodb://teamvirhe:teamvirhe@ds117965.mlab.com:17965/oddogle', {
    useMongoClient: true
  })
  .then(() => console.log('DB connection succesful'))
  .catch((err) => console.log(err));
// */
mongoose.connect('mongodb://localhost/oddogle_dev', {
  useMongoClient: true
})
.then(() => console.log('DB connection succesful'))
.catch((err) => console.log(err));

var app = express();

require("./models/Pictures");
require("./models/User");
require("./models/Feedback");
/*
// module for timed db backups
var backupDb = require('./modules/backupDb.js');
//*/

var pictures = app.use(require('./routes/pictures'));
var index = app.use(require('./routes/index'));
var user = app.use(require('./routes/user'));
var feedback = app.use(require('./routes/feedback'));

var app = express();

// 8.11.2017
app.use(cors());
app.use(express.static(path.join(__dirname, '../')));
app.use('/pictureJPEG',express.static(path.join(__dirname, './../pictures_JPEG')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public

app.use(bodyParser.urlencoded({
  limit:'500kb',
  extended: false
}));


app.use(logger('dev'));
app.use(bodyParser.json({limit:'500kb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
app.use('/user', user);
app.use('/pictures', pictures);
app.use('/feedback', feedback);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404; 
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// 8.11.2017
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('access-Control-Allow-Origin', '*');
  next();
});

// 2017-12-01  
var port = 3000;
app.listen(port, function () {
  console.log('Backend running at port '+port);
 // console.log('error' + err.name);
}); 

// error handlers  
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      "message": err.name + ": " + err.message
    });
  }
}); 

module.exports = app;
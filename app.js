var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
//for setting partials
var hbs=require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

//file uplad module
var fileUpload=require('express-fileupload');

//session module
var session=require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//setting partials
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layouts',layoutDir:__dirname+'/views/layouts/',partialDir:__dirname+'/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//fileuplad
app.use(fileUpload());
var db=require('./config/connection')

app.use(session({
  secret: 'key',
  cookie: { maxAge:60000000}
}))
//db connection
db.connect((err)=>{
  if(err) console.log("database erroe"+err)
  else console.log("database connected")
})


app.use('/', usersRouter);
app.use('/admin', adminRouter);

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

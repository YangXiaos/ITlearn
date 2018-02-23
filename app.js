var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var settings = require('./settings');

var userRouteBuilder = require('./routes/user/user');
var relationRouteBuilder = require('./routes/user/relation');
var collectionRouteBuilder = require('./routes/user/relation');

var commentRouteBuilder = require('./routes/comment');

var recommendRouteBuilder = require('./routes/recommend/recommend');
var tagRouteBuilder = require('./routes/recommend/tag');

var groupRouteBuilder = require('./routes/group/group');


var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('ITLearnSession'));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'ITLearnSession',
    key: 'ITLearnSession', //cookie name
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 15
    }, //30 days
    store: new MongoStore({
        url: 'mongodb://localhost/ITLearnSession',
        db: "ITLearnSession",
        host: 'localhost',
        port: 27017
    })
}));

// 用户模块
app.use(userRouteBuilder.getRouterPath(), userRouteBuilder.router);
app.use(relationRouteBuilder.getRouterPath(), relationRouteBuilder.router);
app.use(collectionRouteBuilder.getRouterPath(), collectionRouteBuilder.router);

// 评论模块
app.use(commentRouteBuilder.getRouterPath(), commentRouteBuilder.router);

// 推荐模块
app.use(recommendRouteBuilder.getRouterPath(), recommendRouteBuilder.router);

// 小组模块
app.use(groupRouteBuilder.getRouterPath(), groupRouteBuilder.router);


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
  res.json({message:err.message, err: req.app.get('env') === 'development' ? err : {}, err1: err});
});

module.exports = app;

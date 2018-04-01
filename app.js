var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] === needle) return true;
    }
    return false;
};
var settings = require('./settings');

// 用户模块
var userRouteBuilder = require('./routes/user/user');
var relationRouteBuilder = require('./routes/user/relation');
var collectionRouteBuilder = require('./routes/user/relation');

// 推荐模块
var recommendRouteBuilder = require('./routes/recommend/recommend');
var tagRouteBuilder = require('./routes/recommend/tag');

// 小组模块
var groupRouteBuilder = require('./routes/group/group');
var topicRouteBuilder = require('./routes/group/topic');

// 评论模块
var commentRouteBuilder = require('./routes/comment');


var app = express();
app.all("*", function (req, res, next) {
    res.header("Cache-Control", "no-store");
    next();
});

var secretOrPrivateKey = "ITlearn";  //加密token 校验token时要使用
app.use(expressJWT({
    secret: secretOrPrivateKey
}).unless({
    path: ['/v1/users/login/',
        '/v1/users/register/',
        '/v1/users/',
        '/v1/tags/',
        '/v1/recommends/',
        '/v1/groups/',
    '/v1/groups/*']  //除了这个地址，其他的URL都需要验证
}));

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
app.use(tagRouteBuilder.getRouterPath(), tagRouteBuilder.router);

// 推荐模块
app.use(recommendRouteBuilder.getRouterPath(), recommendRouteBuilder.router);

// 小组模块
app.use(groupRouteBuilder.getRouterPath(), groupRouteBuilder.router);
app.use(topicRouteBuilder.getRouterPath(), topicRouteBuilder.router);


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
    console.log(err.stack);
  res.json({message:err.message, err: req.app.get('env') === 'development' ? err : {}, err1: err, stack: err.stack});
});

module.exports = app;

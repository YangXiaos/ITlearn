var crypto= require('crypto');

var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/user/user').mBuilder;
var commonFn = require('../../routes/commonFn');

var User = require('../../models/user/user').model;
var md5 = require('../../settings').md5;


var loginFn = function (req, res, next) {
    var condition = {
        password: md5.update(req.body.password),
        email: req.body.email
    };
    User.findOne(condition)
        .then(function (err, user) {
            req.session.user = user;

            if (user){
                res.send();
            } else {
                // 发送异常结果

            }
        });
};

/**
 * 用户模型路由构造器
 * @type {RouterBuilder}
 *
 * 额外路由方法
 *  @url: "/login"
 *  @method: post
 *  用于用户登录验证
 *
 */
var userRouterBuilder = new RouteBuilder(
    mBuilder,
    {
        // patch额外方法
        patchFn: [
            commonFn.checkIsLogin,
            function (req, res, next) {
                if (req.conditions._id === req.session.user._id){
                    next();
                } else {
                    // 发送异常结果

                }
            }
        ],

        // delete额外方法
        deleteFn: [
            commonFn.checkIsLogin,
            function (req, res, next) {
                if (req.session.user.isManager){
                    next()
                } else {
                    // 发送错误异常
                }
            }
        ],

        // 配置额外方法
        extraRule: [
            // 登录额外方法配置
            {
                method: "post",
                url: "/login",
                fn: loginFn
            }
        ],

        // 查询数量限制
        limit: 10
    }
);



module.exports.routerBuilder = userRouterBuilder;

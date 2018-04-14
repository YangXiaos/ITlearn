var crypto= require('crypto');

var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/user/user').mBuilder;
var commonFn = require('../../routes/commonFn');

var User = require('../../models/user/user').model;

/**
 * 登录方法
 * @param req
 * @param res
 * @param next
 */
var loginFn = function (req, res, next) {
    var condition = {
        password: crypto.createHash("md5").update(req.body.password).digest('hex'),
        email: req.body.email
    };
    User.find(condition, "-__v -password", function (err, user) {
        if (user.length === 1){
            req.session.user = user[0]._doc;
            req.session.save();
            res.json({
                status: 0,
                user: req.session.user
            });
        } else {
            // 发送异常结果
            res.json({status: 1, message: "没有该用户"});
        }
    });
};


/**
 * 登出
 * @param req
 * @param res
 * @param next
 */
var logout = function (req, res, next) {
    req.session.user = null;
    res.json({
        status: 0,
        message: "success"
    });
};



/**
 * 校验当前用户是否为目标用户，或者为管理员
 * @param req
 * @param res
 * @param next
 */
var checkUserIsSelfOrIsManager = function (req, res, next) {
    if (req.conditions._id === req.session.user._id || req.session.user.isManager) {
        next();
    } else {
        // 发送异常结果
        res.status(401);
        res.json({status: 0, message: "用户无权限"});
    }
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
var userRouteBuilder = new RouteBuilder(
    mBuilder,
    {
        // post 前置钩子
        postFn: [
            // 判断email 是否被占用
            function (req, res, next) {
                mBuilder.model.find({email: req.doc.email}, function (err, doc) {
                    if (doc.length !== 0) {
                        res.status(422);
                        res.json({status: 1, message: "邮箱已被占用"});
                    } else {
                        next();
                    }
                });
            },
            function (req, res, next) {
                mBuilder.model.find({nickname: req.doc.nickname}, function (err, doc) {
                    if (doc.length !== 0) {
                        res.status(422);
                        res.json({status: 1, message: "昵称已被占用"});
                    } else {
                        next();
                    }
                });
            },
            function (req, res, next) {
                req.doc.password = crypto.createHash("md5").update(req.body.password).digest('hex');
                next();
            }
        ],

        // patch 前置钩子
        patchFn: [
            // commonFn.checkIsLogin,
            // checkUserIsSelfOrIsManager
        ],

        // delete 前置钩子
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkIsManager
        ],

        // 配置 前置钩子
        extraRule: [
            // 登录方法配置
            {
                method: "post",
                url: "/login/",
                fn: loginFn
            },
            {
                method: "get",
                url: "/logout/",
                fn: logout
            }
        ],


        // post请求成功
        postSuccess: function (req, res, data, callback) {
            req.session.user = data;
            req.session.save();
            callback(null, data);
        },

        // 查询数量限制
        limit: 10
    }
);



module.exports = userRouteBuilder;

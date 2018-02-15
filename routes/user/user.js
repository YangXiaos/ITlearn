var crypto= require('crypto');

var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/user/user').mBuilder;
var commonFn = require('../../routes/commonFn');

var User = require('../../models/user/user').model;
var md5 = require('../../settings').md5;

/**
 * 登录方法
 * @param req
 * @param res
 * @param next
 */
var loginFn = function (req, res, next) {
    var condition = {
        password: md5.update(req.body.password),
        email: req.body.email
    };
    User.findOne(condition)
        .then(function (err, user) {
            req.session.user = user;
            if (user){
                res.json({
                    status: 0,
                    user: user
                });
            } else {
                // 发送异常结果
                res.json({status: 1, message: "没有该用户"});
            }
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
                mBuilder.model.findOne({email: req.doc.email}, function (err, doc) {
                    if (doc) {
                        res.status(422);
                        res.json({status: 0, message: "验证错误"});
                    } else {
                        next();
                    }
                });
            }
        ],

        // patch 前置钩子
        patchFn: [
            commonFn.checkIsLogin,
            checkUserIsSelfOrIsManager
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
                url: "/login",
                fn: loginFn
            }
        ],

        // 查询数量限制
        limit: 10
    }
);



module.exports = userRouteBuilder;

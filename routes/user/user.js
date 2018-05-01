var crypto= require('crypto');

var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/user/user').mBuilder;
var commonFn = require('../../routes/commonFn');
var sendEmail = require("../../units").sendEmail;

var User = require('../../models/user/user').model;
var Token = require('../../models/token').model;

/**
 * 登录方法
 * @param req
 * @param res
 * @param next
 */
var loginFn = function (req, res, next) {

    if(req.body.uuid) {
        Token.findOne(req.body, function (err, token) {
            console.log(req.body);
            if(token) {
                User.find({email: req.body.email}, "-__v -password", function (err, user) {
                    if (user.length === 1){
                        user[0].update({$set: {isPass: true}}, function (err, res) {
                            console.log(res);
                        });
                        req.session.user = user[0]._doc;
                        req.session.save();
                        res.json({
                            status: 0,
                            user: req.session.user
                        });
                        Token.remove(req.body, function (err, result) {
                            console.log(JSON.stringify(result));
                        });
                    } else {
                        // 发送异常结果
                        res.status(400);
                        res.json({status: 1, message: "用户异常！"});
                    }
                });
            } else {
                res.status(400);
                res.json({status: 1, message: "验证异常"});
            }
        });

        return;
    }
    var condition = {
        password: crypto.createHash("md5").update(req.body.password).digest('hex'),
        email: req.body.email,
        isPass: true
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
            res.json({status: 1, message: "邮箱或密码错误！"});
        }
    });
};



/**
 * 登录方法
 * @param req
 * @param res
 * @param next
 */
var changPwdFn = function (req, res, next) {
    var condition = {
        password: crypto.createHash("md5").update(req.body.oldPwd).digest('hex'),
        _id: req.body._id
    };
    // 判断是否有该用户
    User.find(condition, function (err, user) {
        if (user.length === 1){
            var update = {
                $set: {
                    password: crypto.createHash("md5").update(req.body.newPwd).digest('hex')
                }
            };
            User.update(condition, update, function (err, result) {
                // 异常操作
                if (err){
                    res.json({status: 1, error: err, message: "网络异常"});
                } else {
                    res.json({status: 0, result: result})
                }
            });
        } else {
            // 发送异常结果
            res.json({status: 1, message: "密码错误"});
        }
    });
};


/**
 * 变更密码函数
 * @param req
 * @param res
 * @param next
 */
var changPwdWithTokenFn = function (req, res, next) {
    var tokenCondition = {email: req.body.email, uuid: req.body.token};
    // 查找是否有token 及匹配email
    Token.findOne(tokenCondition)
        .then(function (data) {
            if (data) {

                // 判断是否有该用户
                User.findOne({email: req.body.email}, function (err, user) {
                    if (user){
                        var update = {
                            $set: {
                                password: crypto.createHash("md5").update(req.body.password).digest('hex')
                            }
                        };
                        // 修改用户
                        user.update(update, function (err, result) {
                            // 异常操作
                            if (err){
                                res.status(400);
                                res.json({status: 1, message: "系统异常"});
                            } else {
                                res.json({status: 0, message: "修改密码成功"});
                            }
                        });

                        Token.remove(tokenCondition, function (err, result) {
                            console.log(JSON.stringify(result));
                        });
                    } else {
                        // 发送异常结果
                        res.status(400);
                        res.json({status: 1, message: "没有改用户"});
                    }
                });
            } else {
                res.json({status: 1, message: "token异常"});
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
            function (req, res, next) {
                if("password" in req.doc) {
                    req.doc.password = crypto.createHash("md5").update(req.doc.password).digest('hex');
                }
                next();
            }
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
            },
            {
                method: "post",
                url: "/change/",
                fn: changPwdFn
            },
            {
                method: "post",
                url: "/pwd/change/",
                fn: changPwdWithTokenFn
            }
        ],


        // post请求成功
        postSuccess: function (req, res, data, callback) {
            // req.session.user = data;
            // req.session.save();
            sendEmail(data.email, true, function (err, info) {
                console.log(err, info);
            });
            callback(null, data);
        },

        // 查询数量限制
        limit: 10
    }
);



module.exports = userRouteBuilder;

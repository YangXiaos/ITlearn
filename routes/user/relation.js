/*
* Create By mryang On 17-8-21
* user应用
* 关注联系collection 路由
*/

var async = require('async');
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/user/relation').mBuilder;
var commonFn = require('../../routes/commonFn');

var Relation = require('../../models/user/relation').model;


// 关注钩子函数
var follow = function (req, res, next) {
    var condition = {
        user: parseInt(req.query.user),
        follower: parseInt(req.query.follower)
    };
    Relation.find(condition, function (err, data) {
        if (data.length === 1) {
            Relation.deleteOne(condition).then(function (err, result) {
                res.json({status: 0, message: "取消关注成功", result: result});
            });
        } else {
            Relation.create(condition, function (err, data) {
                res.json({status: 0, message: "关注成功", data: data._doc});
            });
        }
    });
};

// 查看粉丝数钩子函数
var count = function (req, res, next) {

    async.parallel([
        // 正在关注
        function (callback) {
            Relation.find({user: parseInt(req.query.user)}, function (err, data) {
                callback(null, data);
            });
        },

        // 关注者
        function (callback) {
            Relation.find({follower: parseInt(req.query.user)}, function (err, data) {
                callback(null, data);
            })
        }
    ], function (err, result) {
        res.json({status: 0, message: "获取请求成功", following: result[0], follower: result[1]});
    });

};


module.exports = new RouteBuilder(
    mBuilder,
    {
        // post 前置钩子
        postFn: [
            commonFn.checkIsLogin,
            commonFn.setDocUser
        ],

        // delete 前置钩子
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Relation)
        ],

        // 额外路由钩子
        extraRule: [
            {
                method: "get",
                url: "/follow/",
                fn: follow
            },
            {
                method: "get",
                url: "/user/",
                fn: count
            }
        ],

        // 填充关联字段
        populate: "user follower",
        limit: 20
    }
);

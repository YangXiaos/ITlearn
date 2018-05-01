/*
* Create By mryang On 17-8-26
* 推荐模块 推荐模型路由
*/
var async = require('async');
var recommendModelBuilder = require('../../models/recommend/recommend').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');
var sendPersonDynamic = require("../user/new").sendPersonDynamic;
var sendFollowerDynamic = require("../user/new").sendFollowerDynamic;

var Recommend = require('../../models/recommend/recommend').model;
var Tag = require('../../models/recommend/tag').model;

var vote = function (req, res, next) {

    var condition = {
        _id: req.query.recommend
    };
    var user = parseInt(req.query.user);
    var update = {$addToSet: {upVotes: user}};

    Recommend.findOne(condition)
        .then(function (data) {
            if (data) {
                if (data.upVotes.contains(user)) {
                    res.status(200);
                    res.json({status: 0, isVote: 0, message: "已经点过赞了"});
                } else {
                    data.update(update)
                        .then(function (result) {
                            // todo 结果测试
                            res.json({status: 0, isVote: 1, message: "点赞成功", result: result});

                            sendPersonDynamic({
                                newType: 0,
                                recommend: data._id,
                                sender: parseInt(req.query.user)
                            });
                        }).catch(function (err) {
                            res.status(500);
                            res.json({status: 1, message: "异常problem"});
                        });
                }
            } else {
                // todo 设置状态码
                res.status(404);
                res.json({status: 1, message: "没有该推荐"});
            }
        })
        .catch(function (err) {
            res.status(500);
            console.log(err.stack);
            res.json({status: 1, message: "异常", stack: err.stack})
        })

};


var beforePost = function (req, res, next) {
    function createTag(tagName, callback){
        Tag.create({name: tagName}, function (err, data) {
            callback(null, data);
        });
    }

    var fns = [];
    for (var i = 0; i < req.body.tags.length; i++) {
        var tagName = req.doc.tags[i];
        var fn = (function (tagName) {
            return function (callback) {
                // 查询tag
                Tag.findOne({name: tagName})
                    .then(function (data) {
                        if (data) {
                            callback(null, data._id);
                        } else {
                            createTag(tagName, function (err, data) {
                                callback(err, data._id);
                            });
                        }
                    });
            }
        })(tagName);
        fns.push(fn);
    }

    async.parallel(
        fns,
        function(err, results){
            req.doc.tags = results;
            next();
        });
};


var recommendRouterBuilder = new RouterBuilder(
    recommendModelBuilder,
    {
        // post 前置路由
        postFn: [
            beforePost
            // commonFn.checkIsLogin,
            // commonFn.setDocUser
        ],

        // delete 前置路由
        deleteFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Recommend)
        ],

        // patch 前置路由方法
        patchFn: [
            beforePost
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Recommend)
        ],

        // 配置 前置钩子
        extraRule: [
            // 登录方法配置
            {
                method: "get",
                url: "/vote/",
                fn: vote
            }
        ],

        postSuccess: function (req, res, data, callback) {
            // 创建动态
            sendFollowerDynamic({
                newType: 5,
                recommend: data._id,
                sender: data.user});
            callback(null, data);
        },

        populate: "user tags",
        // 查询数量限制
        limit: 10

    }
);

module.exports = recommendRouterBuilder;

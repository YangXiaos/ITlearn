/*
* Create By mryang On 17-8-26
* 推荐模块 推荐模型路由
*/
var recommendModelBuilder = require('../../models/recommend/recommend').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var Recommend = require('../../models/recommend/recommend').model;


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


var recommendRouterBuilder = new RouterBuilder(
    recommendModelBuilder,
    {
        // post 前置路由
        postFn: [
            commonFn.checkIsLogin,
            commonFn.setDocUser
        ],

        // delete 前置路由
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Recommend)
        ],

        // patch 前置路由方法
        patchFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Recommend)
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

        populate: "user tags",
        // 查询数量限制
        limit: 10

    }
);

module.exports = recommendRouterBuilder;

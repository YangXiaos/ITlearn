/*
* Create By mryang On 17-8-26
* 推荐模块 评论模块
*/
var commentModelBuilder = require('../models/comment').mBuilder;
var RouterBuilder = require('./routeBuilder');
var commonFn = require('./commonFn');
var sendSystemDynamic = require("./user/new").sendSystemDynamic;

var comment = require('../models/comment').model;
var populate = [{
    path: "pid",
    model: "comments",
    populate: [{
        path: "user",
        model: "users"
    }]
}, {
    path: "user",
    model: "users"
}];

module.exports = new RouterBuilder(
    commentModelBuilder,
    {
        // post 前置钩子
        postFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(comment),
            // commonFn.setDocUser
        ],

        // delete 前置钩子
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(comment)
        ],

        // patch 前置钩子
        patchFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(comment)
        ],

        // 数据冷处理
        postSuccess: function (req, res, data, callback) {
            data.populate(populate, function (err, comment) {

                callback(err, comment);

                var new_ = {
                    sender: comment.user._id,
                    comment: comment._id
                };
                if (comment.topic) {
                    new_.topic = comment.topic;
                } else if (comment.recommend) {
                    new_.recommend = comment.recommend;
                } else if (comment.project) {
                    new_.project = comment.project;
                }
                new_.newType = comment.pid ? 3 : 2;
                new_.pid = comment.pid ? comment.pid._id : undefined;
                sendSystemDynamic(new_);
            })
        },

        populate: populate,
        // 限制数量
        limit: 10
    }
);

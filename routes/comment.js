/*
* Create By mryang On 17-8-26
* 推荐模块 评论模块
*/
var commentModelBuilder = require('../models/comment').mBuilder;
var RouterBuilder = require('./routeBuilder');
var commonFn = require('./commonFn');

var comment = require('../models/comment').model;


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

        populate: "user",
        // 限制数量
        limit: 10
    }
);

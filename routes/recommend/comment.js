/*
* Create By mryang On 17-8-26
* 推荐模块 评论模块
*/
var commentModelBuilder = require('../../models/recommend/comment').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var comment = require('../../models/recommend/comment').model;


var commentRouterBuilder = new RouterBuilder(
    commentModelBuilder,
    {
        // post 前置路由
        postFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(comment),
            commonFn.setDocUser
        ],

        // delete 前置路由
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(comment)
        ],

        // patch 前置路由
        patchFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(comment)
        ],

        // 链接
        resourceUrl: ":blog/comment",

        // 限制数量
        limit: 10
    }
);

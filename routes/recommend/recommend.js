/*
* Create By mryang On 17-8-26
* 推荐模块 推荐模型路由
*/
var recommendModelBuilder = require('../../models/recommend/recommend').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var Recommend = require('../../models/recommend/recommend').model;


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

        // 查询数量限制
        limit: 10

    }
);

module.exports = recommendModelBuilder;

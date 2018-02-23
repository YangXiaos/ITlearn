/*
* Create By mryang On 17-8-26
* 推荐应用 标签模块路由
*/
var tagModelBuilder = require('../../models/recommend/tag').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');


var tagRouterBuilder = new RouterBuilder(
    tagModelBuilder,
    {
        // post 前置路由
        postFn: [
            commonFn.checkIsManager
        ],

        // patch 前置路由
        patchFn:[
            commonFn.checkIsManager
        ],

        // delete 前置路由
        deleteFn: [
            commonFn.checkIsManager
        ],

        // 查询数量限制
        limit: 10
    }
);

module.exports = tagRouterBuilder;

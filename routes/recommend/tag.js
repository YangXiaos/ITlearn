/*
* Create By mryang On 17-8-26
* 推荐应用 标签模块路由
*/
var tagModelBuilder = require('../../models/recommend/tag').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var tag = require('../../models/recommend/tag').model;


var tagRouterBuilder = new RouterBuilder(
    tagModelBuilder,
    {
        // post 前置路由
        postFn: [
            commonFn.checkManager
        ],

        // patch 前置路由
        patchFn:[
            commonFn.checkManager
        ],

        // delete 前置路由
        deleteFn: [
            commonFn.checkManager
        ],

        // 查询数量限制
        limit: 10
    }
);

module.exports = tagRouterBuilder;
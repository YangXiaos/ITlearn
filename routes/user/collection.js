/*
* Create By mryang On 17-8-19
* 用户收藏模型路由
*/
var collectionModelBuilder = require('../../models/user/collection').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var Collection = require('../../models/user/collection').model;


var collectionRouterBuilder = new RouterBuilder(
    collectionModelBuilder,
    {
        // get 前置路由
        getFn: [
            commonFn.checkIsLogin
            // commonFn.setConditionUser
        ],

        // post 前置路由
        postFn: [
            commonFn.checkIsLogin,
            commonFn.setDocUser
        ],

        // delete 前置路由
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Collection)
        ],

        // 链接
        resourceUrl: ":user/collection",

        // 查询数量限制
        limit: 10
    }
);


module.exports = collectionRouterBuilder;

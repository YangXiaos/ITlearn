/*
* Create By mryang On 17-8-19
* 用户收藏模型路由
*/
var collectionModelBuilder = require('../../models/user/collection').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var Collection = require('../../models/user/collection').model;


var collectionRouteBuilder = new RouterBuilder(
    collectionModelBuilder,
    {
        // get 前置路由
        getFn: [
            commonFn.checkIsLogin
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
        pidUrl: "/users",
        resourceUrl: "/:user/collections/",

        // 查询数量限制
        limit: 10,

        // 填充
        populate: ""
    }
);


module.exports = collectionRouteBuilder;

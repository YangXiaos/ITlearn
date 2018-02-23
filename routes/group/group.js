/*
* Create By mryang On 18-2-18
* group 模块路由
*/
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/group/group').mBuilder;
var commonFn = require('../../routes/commonFn');

var Group = require('../../models/group/group').model;



module.exports = new RouteBuilder(
    mBuilder,
    {
        // post 前置钩子
        postFn: [
            commonFn.checkIsLogin,
            commonFn.setDocUser
        ],

        // patch 前置钩子
        patchFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Group)
        ],

        // delete 前置钩子
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Group)
        ],


        limit: 20
    }
);



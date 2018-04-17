/*
* Create By mryang On 18-3-30
* 
*/
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/group/topic').mBuilder;
var commonFn = require('../../routes/commonFn');

var Topic = require('../../models/group/topic').model;



module.exports = new RouteBuilder(
    mBuilder,
    {
        // post 前置钩子
        postFn: [
            // commonFn.checkIsLogin,
            // commonFn.setDocUser
        ],

        // patch 前置钩子
        patchFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Topic)
        ],

        // delete 前置钩子
        deleteFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Topic)
        ],

        //填充
        populate: "user group",
        limit: 20
    }
);



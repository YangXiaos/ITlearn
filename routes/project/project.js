/*
* Create By mryang On 18-2-18
* group 模块路由
*/
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/project/project').mBuilder;
var commonFn = require('../../routes/commonFn');


/*
* Create By mryang On 18-4-26
* 
*/
module.exports = new RouteBuilder(
    mBuilder,
    {
        // get 前置路由
        getFn: [
            // commonFn.checkIsLogin
        ],

        // post 前置路由
        postFn: [
            // commonFn.checkIsLogin,
            // commonFn.setDocUser
        ],

        // delete 前置路由
        deleteFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Collection)
        ],


        // 填充, 查询数量限制
        populate: {
            path:"user",
            model: "users"
        },
        limit: 10
    }
);

/*
* Create By mryang On 17-8-21
* user应用
* 关注联系collection 路由
*/
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/user/relation').mBuilder;
var commonFn = require('../../routes/commonFn');

var Relation = require('../../models/user/relation').model;



var relationRouterBuilder = new RouteBuilder(
    mBuilder,
    {

        // post 前置方法
        postFn: [
            commonFn.checkIsLogin,
            commonFn.setDocUser
        ],

        // delete 前置方法
        deleteFn: [
            commonFn.checkIsLogin,
            commonFn.checkUserByModel(Relation)
        ],

        // 额外路由方法
        extraRule: [
            {
                method: "get",
                url: "/count",
                fn: function (req, res, next) {
                    Relation.count(req.conditions, function (err, count) {

                        if (!err){
                            // 返回请求结果
                            res.send()
                        } else {

                        }
                    })
                }
            }
        ],

        limit: 20
    }
);

/*
* Create By mryang On 17-8-19
* 用户收藏模型路由
*/
var collectionModelBuilder = require('../../models/user/collection').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');
var sendPersonDynamic = require("./new").sendPersonDynamic;

var Collection = require('../../models/user/collection').model;


module.exports = new RouterBuilder(
    collectionModelBuilder,
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


        postSuccess: function (req, res, data, callback) {
            callback(null, data);
            sendPersonDynamic({
                newType: 1,
                recommend: data._id,
                sender: req.doc.user
            });
        },

        // 填充, 查询数量限制
        populate: {
            path:"recommend",
            model: "recommends",
            populate: [{
                    path: "user",
                    model: "users"
                },
                {
                    path: "tags",
                    model: "tags"
                }
            ]
        },
        limit: 10
    }
);

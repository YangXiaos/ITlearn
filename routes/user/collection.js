/*
* Create By mryang On 17-8-19
* 用户收藏模型路由
*/
var collectionModelBuilder = require('../../models/user/collection').mBuilder;
var RouterBuilder = require('../routeBuilder');
var commonFn = require('../../routes/commonFn');

var Collection = require('../../models/user/collection').model;
var sendNew = require('../../routes/user/new').sendNew;


module.exports = new RouterBuilder(
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
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Collection)
        ],


        postSuccess: function (req, res, data, callback) {
            callback(null, data);

            // 创建动态
            var new_ = {
                user: data.user,
                recommend: data.recommend,
                type: 2,
                createDateTime: data.createDateTime
            };
            sendNew(new_);
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

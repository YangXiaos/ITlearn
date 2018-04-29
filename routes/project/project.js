/*
* Create By mryang On 18-2-18
* group 模块路由
*/
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/project/project').mBuilder;
var commonFn = require('../../routes/commonFn');
var sendFollowerDynamic = require("../user/new").sendFollowerDynamic;
var getJson = require('../../units').getJson;

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
            function (req, res, next) {
                var _ = req.doc.git.split('/');
                req.doc.owner = _[_.length - 2];
                req.doc.name = _[_.length - 1];
                var requestUrl = "https://api.github.com/repos/" + req.doc.owner + "/" + req.doc.name;
                getJson(requestUrl, function (err, obj) {
                    console.log("抓取成功");
                    if (obj) {
                        if(obj.message && obj.message === ("Not Found")){
                            res.json({status: 0, message: "项目url异常"});
                        } else {
                            next();
                        }
                    } else {
                        res.json({status: 1, message: "提交异常", err: err});
                    }
                });
            }
        ],

        // delete 前置路由
        deleteFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(Collection)
        ],

        postSuccess: function (req, res, data, callback) {
            sendFollowerDynamic({
                newType: 5,
                project: data._id,
                sender: data.user});
            callback(null, data);
        },

        // 填充, 查询数量限制
        populate: {
            path:"user",
            model: "users"
        },
        limit: 10
    }
);

/*
* Create By mryang On 18-2-18
* group 模块路由
*/
var RouteBuilder = require('../routeBuilder');
var mBuilder = require('../../models/group/group').mBuilder;
var commonFn = require('../../routes/commonFn');

var Group = require('../../models/group/group').model;


/**
 * 加入小组函数
 * @param req
 * @param res
 * @param next
 */
function joinFn(req, res, next) {

    var condition = {_id: req.query.group};
    var joinUpdate = {$addToSet: {users: req.query.user}};
    var outUpdate = {$pull: {users: req.query.user}};
    Group.find(condition, function (err, data) {
        if (err) {
            //
            res.status(404);
            res.json({status: 1, message: err});

        } else if(data.length === 1) {
            var group = data[0];
            // 判断小组是否包含当前用户
            if (group.users.contains(req.session.user._id)) {

                // 当前用户退出小组。
                Group.updateOne(condition, outUpdate, function (err, result) {
                    // todo update返回结果判定
                    if (err) {
                        res.status(500);
                        res.json({status: 1, message: "系统异常"});
                    } else if (result.n !== 0){
                        // 修改成功
                        res.status(200);
                        res.json({status: 0, exit: 0, message: "退出成功"});
                    } else {
                        // 服务器异常
                        res.status(500);
                        res.json({status: 1, message: "系统异常"});
                    }
                });
            } else {
                // 当前用户加入小组。
                Group.updateOne(condition, joinUpdate, function (err, result) {
                    // todo update返回结果判定
                    if (err) {
                        res.status(500);
                        res.json({status: 1, message: "系统异常"});
                    } else if (result.n !== 0){
                        res.status(200);
                        res.json({status: 0, exit: 1, message: "加入成功"});
                    } else {
                        res.status(500);
                        res.json({status: 1, message: "系统异常"});
                    }
                });
            }
        } else {
            // 木有小组
            res.status(404);
            res.send({status: 1, message: err});
        }
    });
}


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
        // 配置 前置钩子
        extraRule: [
            // 登录方法配置
            {
                method: "get",
                url: "/join/",
                fn: joinFn
            }
        ],
        populate: "user users",
        limit: 20
    }
);



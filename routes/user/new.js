/*
* Create By mryang On 18-4-15
* 
*/

var newModelBuilder = require('../../models/user/new').mBuilder;
var RouterBuilder = require('../routeBuilder');

var New = require('../../models/user/new').model;
var Relation = require('../../models/user/relation').model;
var Recommend = require('../../models/recommend/recommend').model;
var Topic = require('../../models/group/topic').model;
var Comment = require('../../models/comment').model;

module.exports = new RouterBuilder(
    newModelBuilder,
    {
        // post 前置钩子
        postFn: [
            // commonFn.checkIsLogin,
            // commonFn.checkUserByModel(comment),
            // commonFn.setDocUser
        ],

        // delete 前置钩子
        deleteFn: [

        ],

        // patch 前置钩子
        patchFn: [

        ],

        populate: "user",
        // 限制数量
        limit: 10
    }
);

var sendFollowerNew = function (new_) {
    var condition = {follower: new_.user};
    Relation.find(condition, function (err, data) {
        data.forEach(function (relation) {
            new_.receiver = relation.user;
            console.log(new_);
            createNew(new_);
        });
    });
};


var sendAuthorNew = function (new_, user) {
    var condition = {user: user};
    new_.receiver = user;
    console.log(new_);
    createNew(new_);
};


var createNew = function (new_) {
    delete new_.createDateTime;
    New.findOne(new_, function (err, data) {
        if (data === null) {
            New.create(new_, function (err, data) {
            });
        }
    })
};


var sendNew = function (new_) {
    if (new_.type in [1, 4]){
        sendFollowerNew(new_);
    } else if (new_.hasOwnProperty("recommend") || new_.hasOwnProperty("topic")){
        var Model, condition = {};
        if(new_.hasOwnProperty("recommend")) {
            Model = Recommend;
            condition._id = new_.recommend;
        } else {
            Model = Topic;
            condition._id = new_.topic;
        }

        console.log(condition);
        // 判断是否给作者发送动态
        Model.findOne(condition, function (err, data) {
            if(!(data.user === new_.user)) {
                sendAuthorNew(new_, data.user);
                sendFollowerNew(new_);
            }
        });
    }
};

module.exports.sendNew = sendNew;

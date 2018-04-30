/*
* Create By mryang On 18-4-15
* 
*/

var newModelBuilder = require('../../models/user/new').mBuilder;
var RouterBuilder = require('../routeBuilder');
var copyObj = require("../../units").copyObj;

var New = require('../../models/user/new').model;
var Relation = require('../../models/user/relation').model;
var Recommend = require('../../models/recommend/recommend').model;
var Topic = require('../../models/group/topic').model;
var Group = require('../../models/group/topic').model;
var Project = require('../../models/project/project').model;

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

        populate: [
            {
                path: "recommend",
                model: "recommends"
            }, {
                path: "topic",
                model: "topics"
            }, {
                path: "comment",
                model: "comments"
            }, {
                path: "project",
                model: "projects"
            }, {
                path: "group",
                model: "groups"
            }, {
                path: "sender",
                model: "users"
            }
        ],
        // 限制数量
        limit: 10
    }
);


/**
 * 创建动态
 * @param new_
 */
var createNew = function (new_) {
    delete new_.createDateTime;
    New.findOne(new_, function (err, data) {
        if (data === null) {
            New.create(new_, function (err, doc) {
                console.log('创建动态', err, JSON.stringify(doc));
            });
        }
    })
};


/**
 * 创建个人动态
 * @param new_
 * @param userId
 */
var sendPersonDynamic = function (new_, userId) {
    var model, condition;
    if (new_.newType === 3) {
        model = Comment;
        condition = {_id: new_.pid};
    } else if (new_.hasOwnProperty("recommend")) {
        model = Recommend;
        condition = {_id: new_.recommend};
    } else if(new_.hasOwnProperty("topic")) {
        model = Topic;
        condition = {_id: new_.topic};
    } else if(new_.hasOwnProperty("project")) {
        model = Project;
        condition = {_id: new_.project};
    }
    model.findOne(condition)
        .then(function (data) {
            if(new_.sender !== data.user) {
                new_.receiver = data.user;
                new_.type = 0;
                createNew(new_);
            }
        });
};


/**
 * 创建关注者动态
 * @param new_
 */
var sendFollowerDynamic = function (new_) {
    console.log(new_);
    var condition = {follower: new_.sender};
    Relation.find(condition, function (err, data) {
        console.log(data);
        data.forEach(function (relation) {
            var new1 = copyObj(new_);
            new1.receiver = relation.user;
            new1.type = 1;
            createNew(new1);
        });
    });
};


/**
 * 创建系统动态
 * @param new_
 * @param userId
 */
var sendSystemDynamic = function (new_, userId) {
    new_.receiver = userId;
    new_.type = 2;
    createNew(new_);
};


module.exports.sendPersonDynamic = sendPersonDynamic;
module.exports.sendFollowerDynamic = sendFollowerDynamic;
module.exports.sendSystemDynamic = sendSystemDynamic;

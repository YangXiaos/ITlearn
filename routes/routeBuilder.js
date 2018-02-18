/**
 * Created by mryang on 17-8-14.
 * 1. routerOptions选项添加重写资源的请求函数
 * 2.
 */
var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var CollectionsId = require('../models/collectionsIdSchema');
var settings = require('../settings');

mongoose.connect('mongodb://localhost/ITlearning');

// 获取条件
function extractFields(reqConditions, fields) {
    var params = {};

    // 循环条件
    for(var fieldName in fields){
        var fn = fields[fieldName];
        var param = reqConditions[fieldName];

        if (param){
            params[fieldName] = fn(param)
        }
    }

    return params
}

// 路由设定
function RouterBuilder(modelBuilder, routerOptions) {
    var routerBuilder = this;

    // 获取字段
    var fields = modelBuilder.schema.obj;
    this.fields = {};
    this.populateFields = {};
    for (var key in fields){
        var val = fields[key];
        if (val instanceof Array){
            continue;
        }
        if (val instanceof Object){
            this.fields[key] = val.type;
        }
        else {
            this.fields[key] = val;
        }
    }


    // 设置默认参数
    var defaultRouterOptions = {
        resourceUrl: "",
        pidUrl: undefined,
        limit: 20,

        // 参数提取
        toMeta: {}, // 属性控制变量{name: String}
        // 钩子函数
        postFn: [],
        deleteFn: [],
        getFn: [],
        patchFn: [],

        postSuccess: function (req, doc) {},
        deleteSuccess: function (req, doc) {},
        getSuccess: function (req, doc) {},
        patchSuccess: function (req, doc) {},

        populate: "",
        filedList: "-__v",
        extraRule: []
    };

    for (var key in defaultRouterOptions){
        if(key === "filedList"){
            routerOptions[key] = defaultRouterOptions[key] + " " + routerOptions[key];
        } else if (!(key in routerOptions)){
            routerOptions[key] = defaultRouterOptions[key];
        }
    }

    //集合名
    this.collectionName = modelBuilder.collectionName;
    this.model = modelBuilder.model;
    this.router = express.Router();

    /**
     * query 抽取函数
     * @param req
     * @param res
     * @param next
     */
    this.setup = function (req, res, next) {
        req.metaKey = null;
        req.conditions = extractFields(req.query, this.fields);
        req.doc = extractFields(req.body, this.fields);
        req.params = extractFields(req.params, this.fields);
        req.filedList = routerOptions.filedList;
        // 获取查询规则
        var conditions = {};
        conditions["_id"] = "_id" in req.conditions? req.conditions._id: Object.assign(req.params, req.conditions);

        req.conditions = conditions;
        next();
    };

    this.router.route("*").all(this.setup);

    for (var i = 0; i < routerOptions.extraRule.length; i++){
        var rule = routerOptions.extraRule[i];
        routerBuilder.router[rule.method](rule.url, rule.fn);
    }

    this.router.route(routerOptions.resourceUrl)
        .post(routerOptions.postFn, function (req, res) {

            routerBuilder.model.create(req.doc, function (err, doc) {
                // 异常操作
                if (err){
                    res.status(404);
                    res.json({error: err});
                } else {
                    routerOptions.postSuccess(req, doc);
                    res.json(doc);
                }
            });
        })
        .delete(routerOptions.deleteFn, function (req, res) {

            routerBuilder.model.remove(req.conditions, function (err, result) {
                // 异常操作
                if (err){
                    res.status(404);
                    res.json({error: err});
                } else {
                    routerOptions.deleteSuccess(req, result);
                    res.json(result);
                }
            });
        })
        .get(routerOptions.getFn, routerOptions.filedList, function (req, res) {

            // option设定, 确认skip limit查询,
            var options = {limit: routerOptions.limit, sort: {_id: -1}};
            if (req.query.skip) {
                options.skip = Number(req.query.skip) * routerOptions.limit
            }
            if (req.query.sort) {
                options.sort[req.query.sort] = Number(req.query.sortType);
            }

            routerBuilder.model
                .find(req.conditions, req.filedList, options)
                .populate(routerOptions.populate)
                .exec(function (err, docs) {
                    // 异常操作
                    if (err){
                        res.status(404);
                        res.json({status: 0, error: err});
                    } else {
                        routerOptions.getSuccess(req, docs);
                        res.json({status: 1, data: docs});
                    }
                });
        })
        .patch(routerOptions.patchFn, function (req, res) {

            var operation = req.query["operation"];  // 其他操作方法　类似$push
            var toMeta = req.query.toMeta;  // 修改的对象属性,
            var value = toMeta? req.body[toMeta] : undefined;  // 修改的对象的操作的值

            // update 设定
            var update = {};
            if (operation){
                update[operation] = {};
                update[operation][toMeta] = value;
            } else {
                update = {$set: req.doc};
            }

            routerBuilder.model.update(req.conditions, update, function (err, docs) {
                // 异常操作
                if (err){
                    res.status(404);
                    res.json({error: err});
                } else {
                    routerOptions.getSuccess(req, docs);
                    res.json(docs);
                }
            });

        });

    this.getRouterPath = function () {
        if(routerOptions.pidUrl) {
            return "/" + settings.version + "/" + routerOptions.pidUrl;
        } else {
            return "/" + settings.version + "/" + this.collectionName;
        }
    };

}

module.exports = RouterBuilder;
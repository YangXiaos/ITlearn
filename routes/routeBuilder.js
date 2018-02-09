/**
 * Created by mryang on 17-8-14.
 * 1. routerOptions选项添加重写资源的请求函数
 * 2.
 */
var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var CollectionsId = require('../models/collectionsIdSchema');


mongoose.connect('mongodb://localhost/ITlearning');

// 获取条件
function getConditions(reqConditions, fields) {
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
        limit: 20,

        // 参数提取
        toMeta: {}, // 属性控制变量{name: String}

        // 路由函数
        postFn: [],
        deleteFn: [],
        getFn: [],
        patchFn: [],

        postSuccess: function (req, doc) {

        },
        deleteSuccess: function (req, doc) {

        },
        getSuccess: function (req, doc) {

        },
        patchSuccess: function (req, doc) {

        },

        extraRule: []
    };
    for (var key in defaultRouterOptions){
        if (!(key in routerOptions)){
            routerOptions[key] = defaultRouterOptions[key];
        }
    }

    //集合名
    this.collectionName = modelBuilder.collectionName;
    this.model = modelBuilder.model;
    this.router = express.Router();

    // 获取路径参数函数, query函数
    this.getQueries = function (req, res, next) {
        req.metaKey = null;
        req.conditions = getConditions(req.query, this.fields);
        req.doc = getConditions(req.body, this.fields);
        req.params = getConditions(req.params, this.fields);

        // 获取查询规则
        var conditions = {};
        if ("_id" in req.conditions){
            conditions["_id"] = req.conditions._id;
        } else {
            conditions = Object.assign(req.params, req.conditions);
        }
        req.conditions = conditions;

        next();
    };

    this.router.route("*").all(this.getQueries);

    for (var i = 0; i < routerOptions.extraRule.length; i++){
        var rule = routerOptions.extraRule[i];
        switch (rule.method){
            case "post" || "POST":
                routerBuilder.router.post(rule.url, rule.fn);
                break;
            case "DELETE" || "delete":
                routerBuilder.router.delete(rule.url, rule.fn);
                break;
            case "get":
                routerBuilder.router.get(rule.url, rule.fn);
                break;
            case "PATCH" || "patch":
                routerBuilder.router.patch(rule.url, rule.fn);
                break;
        }
    }

    this.router.route(routerOptions.resourceUrl)
        .post(routerOptions.postFn, function (req, res) {
            routerBuilder.model.create(req.doc, function (err, doc) {
                // 异常操作
                if (err){

                } else {
                    routerOptions.postSuccess(req, doc);
                }

                res.json(doc);
            });
        })
        .delete(routerOptions.deleteFn, function (req, res) {
            routerBuilder.model.remove(req.conditions, function (err, result) {
                // 异常操作
                if (err){

                } else {
                    routerOptions.deleteSuccess(req, result);
                    res.json(result);
                }
            });
        })
        .get(routerOptions.getFn, function (req, res) {

            // option设定, 确认skip limit查询,
            var options = {limit: routerOptions.limit, sort: {_id: -1}};
            if (req.query.skip) {
                options.skip = Number(req.query.skip) * routerOptions.limit
            }
            if (req.query.sort) {
                options.sort[req.query.sort] = Number(req.query.sortType)
            }

            routerBuilder.model.find(req.conditions, req.metaKey, options, function (err, docs) {
                // 异常操作
                if (err){

                } else {
                    routerOptions.getSuccess(req, docs);
                    res.json(docs);
                }

            });
        })
        .patch(routerOptions.patchFn, function (req, res) {

            var operation = req.query.operation;
            var toMeta = req.query.toMeta;
            var val = toMeta? routerOptions[toMeta](req.query.value): undefined;

            // json修改
            var update = operation? {operation: {toMeta: val}}: {$set: req.body};

            routerBuilder.model.update(req.conditions, update, function (err, docs) {
                // 异常操作
                if (err){

                } else {
                    routerOptions.getSuccess(req, docs);
                    res.json(docs);
                }
            });

        });

    this.getRouterPath = function () {
        return "/" + this.collectionName;
    }
}

module.exports = RouterBuilder;
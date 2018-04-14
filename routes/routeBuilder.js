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

mongoose.connect('mongodb://localhost/' + settings.dbName);

// 获取条件
function extractFields(reqConditions, fields) {
    var params = {};

    // 循环条件
    for(var fieldName in fields){
        var field =  fields[fieldName];
        var value = reqConditions[fieldName];

        if (value instanceof Array) {
            params[fieldName] = value;
            continue;
        }

        if (value && typeof field === "function") {
            params[fieldName] = field(value);
            continue;
        }

        if (value && typeof field === "object"){
            if (field instanceof Array) {
                if (fieldName === 'tags') {
                    continue;
                }
                params[fieldName] = field[0].type(value);
            } else {
                params[fieldName] = field.type(value);
            }
        }
    }

    return params;
}

// 路由设定
function RouterBuilder(modelBuilder, routerOptions) {
    var routerBuilder = this;

    // 获取字段
    var fields = modelBuilder.schema.obj;
    this.fields = {};
    this.populateFields = {};
    for (key in fields){
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

        postSuccess: function (req, res, data) {
            res.json({status: 0, data: data});
        },
        deleteSuccess: function (req, res, result) {
            // todo 删除结果操作
            if (result.result.ok === 1) {
                res.status(204);
                res.json({});
            }
        },
        getSuccess: function (req, res, doc) {},
        patchSuccess: function (req, res, result) {
            res.json({status: 0, result: result});
        },

        populate: "",
        filedList: "-__v",
        extraRule: []
    };

    for (var key in defaultRouterOptions){
        if(key === "filedList"){
            if(routerOptions[key]){
                routerOptions[key] = defaultRouterOptions[key] + " " + routerOptions[key];
            } else {
                routerOptions[key] = "-__v";
            }
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
        req.conditions = extractFields(req.query, fields);
        req.doc = extractFields(req.body, fields);
        req.params = extractFields(req.params, fields);
        req.filedList = routerOptions.filedList;

        // 获取查询规则
        req.conditions= Object.assign(req.params, req.conditions);
        next();
    };

    this.router.route("*").all(this.setup);

    for (var i = 0; i < routerOptions.extraRule.length; i++){
        var rule = routerOptions.extraRule[i];
        routerBuilder.router[rule.method](rule.url, rule.fn);
    }
    this.router.route("/count/").get(function (req, res) {
        routerBuilder.model.find(req.conditions, function (err, data) {
            if (err) {
                res.status(500);
                res.json({status: 1, error: err, stack: err.stack});
            } else {
                res.status(200);
                res.json({status: 0, error: err, count: data.length});
            }
        });
    });

    this.router.route(routerOptions.resourceUrl)
        .post(routerOptions.postFn, function (req, res) {
            routerBuilder.model.create(req.doc, function (err, data) {
                // 异常操作
                if (err) {
                    res.status(404);
                    console.log(err.stack);
                    res.json({error: err, stack: err.stack});
                } else {
                    routerOptions.postSuccess(req, res, data);
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
                    routerOptions.deleteSuccess(req, res, result);
                }
            });
        })
        .get(routerOptions.getFn, function (req, res) {

            // option设定, 确认skip limit查询,
            var options = {limit: routerOptions.limit, sort: {_id: -1}};
            if (req.query.page_size) {
                options.limit = Number(req.query.page_size)
            }
            if (req.query.page) {
                options.skip = (Number(req.query.page) - 1) * routerOptions.limit
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
                        console.log(err.stack);
                        res.json({status: 1, error: err, stack: err.stack});
                    } else {
                        routerOptions.getSuccess(req, docs);
                        res.status(200);
                        res.json({status: 0, data: docs});
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

            routerBuilder.model.update(req.conditions, update, function (err, result) {
                // 异常操作
                if (err){
                    res.status(404);
                    res.json({error: err});
                } else {
                    routerOptions.getSuccess(req, res, result);
                }
            });

        });

    this.getRouterPath = function () {
        if(routerOptions.pidUrl) {
            return "/" + settings.version + routerOptions.pidUrl;
        } else {
            return "/" + settings.version + "/" + this.collectionName;
        }
    };

}

module.exports = RouterBuilder;
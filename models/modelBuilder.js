/* mongoose 对象构造器
*   用于初始化 orm
*
* */


var async = require('async');
var mongoose = require('mongoose');

var incIdSchema = require('../models/collectionsIdSchema');


mongoose.connect('mongodb://localhost/ITlearning');


// 重置创建对象方法
function resetCreateFn(schema) {
    schema.statics.create = function (doc, _cb) {

        var Model = this;
        async.waterfall([
            function (callback) {
                incIdSchema.inicByCName(Model.modelName, function (err, id) {
                    callback(err, id)
                });
            },
            function (id, callback) {
                doc["_id"] = id;

                // 保存文档
                var entity = new Model(doc);
                entity.save();
                callback(null, entity);
            }
        ], function (err, doc) {
            _cb(err, doc);
        });
    };
}


function ModelBuilder(schemaFields, options) {

    var modelBuilder = this;
    schemaFields = schemaFields || {};
    var incId = options.incId || false;
    var plugin = options.plugin || undefined;

    // 字段设置自增_id
    if (incId){
        schemaFields["_id"] = Number;
    }

    this.collectionName = options.collectionName;
    this.schema = new mongoose.Schema(schemaFields);

    // 是否有插件
    plugin? this.schema.plugin(plugin): undefined;

    // 重新定义创建对象方法
    incId? this.schema.plugin(resetCreateFn): undefined;

    this.model = mongoose.model(this.collectionName, this.schema);

}

module.exports = ModelBuilder;
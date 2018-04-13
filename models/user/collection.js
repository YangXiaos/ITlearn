/*
* Create By mryang On 17-8-19
* 用户收藏orm模型
*/
var ModelBuilder = require('../modelBuilder');


/**
 * 用户收藏orm模型
 * @type {ModelBuilder}
 *
 * schemaField
 *  @field: _id {@Number} 自增id
 *  @field: user {@type: Number} 用户关联ref
 *  @field: blog {@type: Number} blog关联ref
 *
 * schemaOptions
 *  @field: collectionName: "collection"
 */
var mBuilder = new ModelBuilder(
    {
        _id: Number,
        user: {type: Number, ref: "users"},
        recommend: {type: Number, ref: "recommends", require: true},
        date: {type: Date, default: Date.now}
    },
    {
        collectionName: "collections",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
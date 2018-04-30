/*
* Create By mryang On 17-8-19
* 推荐应用 推荐标签模块
*/
var ModelBuilder = require('../modelBuilder');


/**
 *
 * @type {ModelBuilder}
 * schema:
 *  @filed: _id {@type: Number} 自增id
 *  @filed: name {@type: String} 标签名
 *
 * schemaOptions
 *  @field: collectionName: "recommendTag"
 */
var mBuilder = new ModelBuilder(
    {
        _id: Number,
        name: String,
        color: {type: String, default: "#596559"},
    },
    {
        collectionName: "tags",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;


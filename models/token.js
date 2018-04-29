/*
* Create By mryang On 18-4-29
* 
*/

var ModelBuilder = require('./modelBuilder');

/**
 * comment
 * @type {ModelBuilder}
 * schema:
 *  @filed: _id {@type: Number} 自增id
 *  @filed: user {@type: Number} 用户关联id
 *  @filed: createDateTime {@type: Date} 创建时间
 *  @filed: content {@type: String} 内容
 *  @filed: pid {@type: [Number]} 父级评论
 *
 * schemaOptions
 *  @field: collectionName: "comments"
 */
var mBuilder = new ModelBuilder(
    {
        email: {type: String},
        uuid: {type: String}
    },
    {
        collectionName: "tokens",
        incId: false
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
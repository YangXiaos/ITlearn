/*
* Create By mryang On 17-8-19
* 小组学习模块
*/
var ModelBuilder = require('../modelBuilder');

/**
 * groups
 * @type {ModelBuilder}
 * schema:
 *  @filed: _id {@type: Number} 自增id
 *  @filed: user {@type: Number} 用户关联id
 *  @filed: createDateTime {@type: Date} 创建时间
 *  @filed: desc {@type: String} 简介
 *  @filed: name {@type: String} 标题
 *
 * schemaOptions
 *  @field: collectionName: "groups"
 */
var mBuilder = new ModelBuilder(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        desc: {
            type: String,
            default: ""
        },
        createDateTime: {type: Date, default: Date.now},
        user: {type: Number, ref: 'users'}
    },
    {
        collectionName: "groups",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
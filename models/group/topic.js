/*
* Create By mryang On 18-3-30
* 话题model
*/
var ModelBuilder = require('../modelBuilder');

/**
 * groups
 * @type {ModelBuilder}
 * schema:
 *  @filed: _id {@type: Number} 自增id
 *  @filed: user {@type: Number} 用户关联id
 *  @filed: createDateTime {@type: Date} 创建时间
 *  @filed: title {@type: String} 标题
 *  @filed: content {@type: String} 内容
 *  @field: upUsers {@type: [Number]} 点赞用户
 *
 * schemaOptions
 *  @field: collectionName: "topic"
 */
var mBuilder = new ModelBuilder(
    {
        user: {
            type: Number,
            ref: 'users',
            required: true
        },
        group:{
            type: Number,
            ref: "groups",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createDateTime: {type: Date, default: Date.now},
        upUsers: [{type: Number, ref: 'users'}]
    },
    {
        collectionName: "topics",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
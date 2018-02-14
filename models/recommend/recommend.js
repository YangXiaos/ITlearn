/*
* Create By mryang On 17-8-19
* 推荐模块 推荐模型
*/
var ModelBuilder = require('../modelBuilder');

/**
 * recommend
 * @type {ModelBuilder}
 * schema:
 *  @filed: _id {@type: Number} 自增id
 *  @filed: user {@type: Number} 用户关联id
 *  @filed: url {@type: String} 推荐url
 *  @filed: createDateTime {@type: Date} 创建时间
 *  @filed: desc {@type: String} 简介
 *  @filed: title {@type: String} 标题
 *  @filed: content {@type: String} 内容
 *  @filed: recommendTags {@type: [Number]} 推荐标签id关联
 *  @filed: upVotes {@type: [Number]} 点赞用户id关联
 *
 * schemaOptions
 *  @field: collectionName: "recommends"
 */
var mBuilder = new ModelBuilder(
    {
        user: {type: Number, ref: "users"},
        url: String,
        createDateTime: {type: Date, default: Date.now},
        desc: {type: String, default: ""},
        title: String,
        content: String,
        tags: [{type: Number, ref: "users"}],
        upVotes: [{type: Number, ref: "users"}]
    },
    {
        collectionName: "recommends",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
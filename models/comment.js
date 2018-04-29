/*
* Create By mryang On 17-8-19
* 评论模型
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
        user: {type: Number, ref: "users"},
        createDateTime: {type: Date, default: Date.now},
        content: String,

        recommend: {type: Number, ref: "recommends"},
        project: {type: Number, ref: "projects"},
        topic: {type: Number, ref: "topics"},
        upVotes: [{type: Number, ref: "users"}],
        pid: {type: Number, ref: "comments"}
    },
    {
        collectionName: "comments",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
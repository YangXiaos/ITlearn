/*
* Create By mryang On 18-4-15
* 
*/
var ModelBuilder = require('../modelBuilder');


/**
 * 用户收藏orm模型
 * @type {ModelBuilder}
 *
 * schemaField
 *  @field: _id {@Number} 自增id
 *  @field: user {@type: Number} 用户关联ref
 *
 *  消息类型
 *  0: 为动态
 *  1: 系统消息
 *  2: 个人消息
 * schemaOptions
 *  @field: collectionName: "collection"
 */
var mBuilder = new ModelBuilder(
    {
        // 创建该消息的人, 接收该消息用户
        sender: {type: Number, ref: "users"},
        receiver: {type: Number, ref: "users"},

        // 推荐,话题,评论关联
        recommend: {type: Number, ref: "recommends"},
        topic: {type: Number, ref: "topics"},
        comment: {type: Number, ref: "topics"},

        // 消息类型, 0为个人消息, 1为动态消息, 2为系统消息
        type: {type: Number},

        // 消息格式
        newType: {type: Number},
        content: {type: String},
        isPass: {type: Boolean},

        // 是否查看
        isSee: {type: Boolean, default: false},
        date: {type: Date, default: Date.now}
    },
    {
        collectionName: "news",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
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
 *  {
 *      1: "发表了某个文章", 只需对粉丝发动态
 *      2: "收藏了某个文章", 判断是否为share的user 是否为user， 否 对粉丝发动态，对share发动态
 *      3: "点赞了某个文章", 判断是否为share的user 是否为user， 否 对粉丝发动态，对share发动态
 *      4: "发表了某个topic", 只需对粉丝发动态
 *      5: "对某个share发表了某个评论", 如果 share的user == comment的user, 否 对粉丝发动态，对share的user发动态，对pid.user 不等于 share.user 发动态
 *      6: "对某个topic发表了某个评论", 如果 topic的user == comment的user, 否 对粉丝发动态，对share的user发动态，对pid.user 不等于 share.user 发动态
 *
 *      7: 关注用户发表
 *  }
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
        // 创建该消息的人
        sender: {type: Number, ref: "users"},
        //
        receiver: {type: Number, ref: "users"},

        // 推荐,话题, 评论
        recommend: {type: Number, ref: "recommends"},
        topic: {type: Number, ref: "topics"},
        comment: {type: Number, ref: "topics"},

        isSee: {type: Boolean, default: false},
        type: {type: Number},
        createDateTime: {type: Date, default: Date.now},
        newType: {type: Number}
    },
    {
        collectionName: "news",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
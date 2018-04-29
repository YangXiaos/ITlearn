/*
* Create By mryang On 18-4-16
* 
*/
var ModelBuilder = require('../modelBuilder');


/*
    消息类型。
    1. 场景
                            通知对象    条件
        用户对文章点赞         文章作者      用户不为文章作者
        用户收藏文章           文章作者     用户不为文章作者
        用户对话题发表评论       话题作者    用户不为话题作者
        用户对文章发表评论       文章作者    用户不为评论作者
        用户对评论发表回复       文章作者    用户不为回复作者
    2.

 */
var mBuilder = new ModelBuilder(
    {
        user: {type: Number, ref: "users"},
        sender: {type: Number, ref: "users"},

        // 推荐,话题, 评论
        recommend: {type: Number, ref: "recommends"},
        topic: {type: Number, ref: "topics"},
        comment: {type: Number, ref: "topics"},

        isSee: {type: Boolean, default: false},
        type: {type: Number},
        createDateTime: {type: Date, default: Date.now}
    },
    {
        collectionName: "notice",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
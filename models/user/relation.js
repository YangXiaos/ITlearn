/*
* Create By mryang On 17-8-19
* 用户关系orm
*/

var ModelBuilder = require('../modelBuilder');

/**
 * 用户关系orm模型 构造器
 * @type {ModelBuilder}
 * schema:
 *  @filed: _id {@type: Number}
 *  @filed: user {@type: } 关注用户
 *  @filed: follower {@type: } 被关注用户
 * schemaOptions
 *  @field: collectionName: "relation"
 */
var mBuilder = new ModelBuilder(
    {
        _id: Number,
        user: {type: Number, ref: 'users'},
        follower: {type: Number, ref: 'users'}
    },
    {
        collectionName: "relations",
        incId: true,
        plugin: function (schema) {
            schema.pre("save", function (next) {
                var err = this.user === this.followedUser?
                    new Error("数据异常"): null;
                next(err);
            });
        }
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;

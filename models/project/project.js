/*
* Create By mryang On 17-8-18
* 用户模型 定义
*/
var ModelBuilder = require('../modelBuilder');

/**
 * 用户模型orm定义
 * @type {ModelBuilder}
 *
 * 字段定义
 * email: 邮箱, 账号账户
 * nickname: 昵称
 * password: 加密密码
 * headImg: 头像路径
 * sex: 性别 {1: 男, 2: 女性}
 * desc: 个人备注
 * isManager: 是否为管理员
 */
var mBuilder = new ModelBuilder(
    {
        user: {type: Number, require: true, ref: "users"},

        git: {type: String, require: true},
        name: {type: String, default: ""},

        state: {type: Number, default: 0},
        desc: {type: String, default: ""},
        date: {type: Date, default: Date.now}
    },
    {
        collectionName: "projects",
        incId: true
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
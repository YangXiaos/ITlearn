/*
* Create By mryang On 17-8-18
* 用户模型 定义
*/
var ModelBuilder = require('../modelBuilder');
var md5 = require('../../settings').md5;

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
        email: String,
        nickname: String,
        password: String,
        headImg: {type: String, default: "/media/headImg/default.jpg"},
        sex: {type: Number, default: 1},
        desc: {type: String, default: ""},
        isManager: {type: Boolean, default: false}
    },
    {
        collectionName: "users",
        incId: true,
        plugin: function (schema) {
            schema.pre("save", function (next) {
                this.password = md5.update(this.password).digest("hex");
                next();
            })
        }
    }
);


module.exports.model = mBuilder.model;
module.exports.schema = mBuilder.schema;
module.exports.mBuilder = mBuilder;
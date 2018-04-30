/*
* Create By mryang On 18-4-20
* 
*/
var async = require("async");
var request = require("request");
var nodemailer = require('nodemailer');
var User = require('./models/user/user').model;
var Token = require('./models/token').model;
var UUID = require('node-uuid');


/**
 * query {_id: 1}
 * doc {upVote: 2}
 * @param query
 * @param doc
 * @param model
 * @param callback
 */
var toggleMeta = function (query, doc, model, callback) {
    var query1 = Object.assign(query, doc);
    async.waterfall([
        function(cb){
            model.findOne(query1, function (err, data) {
                cb(err, data);
            });
        },
        function(data, cb){
            var update = data? {$pull: doc}: {$addToSet: doc};
            model.updateOne(query, update, function (err, result) {
                cb(err, result, data !== null);
            });
        }
    ], function (err, result, isHas) {
        callback(err, result, isHas);
    });
};


var emailFn = function (email, callback) {
    var transporter = nodemailer.createTransport({
        //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
        service: 'qq',
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: '178069857@qq.com',
            //这里密码不是qq密码，是你设置的smtp密码
            pass: 'zymcbnvqwdcxbgcf'
        }
    });

    var token = UUID.v4();
    Token.create({uuid: token, email: email});

    var mailOptions = {
        from: '178069857@qq.com', // 发件地址
        to: email, // 收件列表
        subject: '来自程序员交流平台',
        text: 'Hello world 喵喵喵?',
        html: '<b>点击修改你的密码 <a href="http://localhost:8080/set-new-Pwd/?email=' + email + '&token?=' + token + '">修改密码</a></b>' // html 内容
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        console.log(error);
        callback(error, info);
    });
};


var sendEmail = function (email, callback) {

    User.findOne({email: email})
        .then(function (data) {
            if (data) {
                emailFn(email, callback)
            } else {
                callback('no user', "没有该用户");
            }
        });
};




function getJson(url, callback) {
    var options = {
        url: url,
        headers: {'User-Agent': 'request'}
    };
    request(options, function (err, result) {
        if (err) {
            console.log("错误：" + err);
            callback(err, null);
        } else {
            callback(err, JSON.parse(result.body));
        }
    });
}

function copyObj(obj){
    var newObj = {};
    for (var attr in obj) {
        newObj[attr] = obj[attr];
    }
    return newObj;
}

module.exports.toggleMeta = toggleMeta;
module.exports.sendEmail = sendEmail;
module.exports.getJson = getJson;
module.exports.copyObj = copyObj;
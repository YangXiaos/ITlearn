/*
* Create By mryang On 18-4-25
* 
*/



// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//     //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
//     service: 'qq',
//     port: 465, // SMTP 端口
//     secureConnection: true, // 使用 SSL
//     auth: {
//         user: '178069857@qq.com',
//         //这里密码不是qq密码，是你设置的smtp密码
//         pass: 'zymcbnvqwdcxbgcf'
//     }
// });
//
//
// var mailOptions = {
//     from: '178069857@qq.com', // 发件地址
//     to: '835612575@qq.com', // 收件列表
//     subject: 'Hello sir', // 标题
//     //text和html两者只支持一种
//     text: 'Hello world ?', // 标题
//     html: '<b>喵喵喵<a href="http://localhost:8080/?' + 'email' + '">密码页</a></b>' // html 内容
// };
//
// // send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Message sent: ' + info.response);
//
// });
//
// // module.exports.sendEmail = sendEmail;
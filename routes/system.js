/*
* Create By mryang On 18-4-28
* 
*/

var express = require('express');
var sendEmail = require("../units").sendEmail;

var router = express.Router();


router.all("/email", function (req, res, next) {
    sendEmail(req.body.email, false, function (err, info) {
        console.log(err);
        if (err === "no user") {
            res.json({status: 1, message: info});
        } else if (err){
            res.json({status: 1, message: "发送失败"});
        } else {
            res.json({status: 0, message: info});
        }
    });
});

module.exports = router;
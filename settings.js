
var crypto= require('crypto');

var incCollectionList = [
    "user",
    "relation",
    "collection",
    "comment",
    "recommend",
    "recommendTag"
];



var md5 = crypto.createHash("md5");

// 数据库
var sessionConfig = {
    db: "ITLearnSession",
    url: 'mongodb://localhost/ITLearnSession',
    host: 'localhost',
    port: 27017
};


// 版本库
var version = 'v1';


module.exports.version = version;
module.exports.md5 = md5;
module.exports.dirName = __dirname;
module.exports.incCollectionList = incCollectionList;
module.exports.sessionConfig = sessionConfig;

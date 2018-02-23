
var crypto= require('crypto');

var incCollectionList = [
    "users",
    "relations",
    "collections",
    "comments",
    "recommends",
    "tags"
];


var dbName = ""


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
module.exports.dirName = __dirname;
module.exports.incCollectionList = incCollectionList;
module.exports.sessionConfig = sessionConfig;

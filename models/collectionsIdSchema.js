/**
 * Created by mryang on 17-8-13.
 */
var mongoose = require('mongoose');

var settings = require("../settings");


mongoose.connect('mongodb://localhost/ITlearning');


var collectionsIdSchema = new mongoose.Schema({
    _id: String,
    maxId: {type: Number, default: 0}
});
collectionsIdSchema.statics.inicByCName = function (collectionName, cb) {
    this.findOneAndUpdate({_id: collectionName}, {$inc: {maxId: 1}}, function (err, doc) {
        cb(err, doc.maxId + 1);
    });
};
var CollectionsId = mongoose.model("collectionsId", collectionsIdSchema);


// 添加默认列表
settings.incCollectionList.forEach(function (cName) {
    var condition = {_id: cName};
    CollectionsId.find(condition, function (err, doc) {
        if (doc != []) {
            CollectionsId.create(condition)
        }
    });
});

module.exports = CollectionsId;
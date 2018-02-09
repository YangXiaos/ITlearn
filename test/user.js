var mongoose = require('mongoose');
var async = require('async');

var CollectionsId = require('../models/collectionsIdSchema');
mongoose.connect('mongodb://localhost/ITlearning');


// //定义学生模式, 班级模式
// var UserSchema = new mongoose.Schema({
//     _id: Number,
// 	name: String,
// 	clazzID : [{
// 		type : mongoose.Schema.ObjectId,
// 		ref : 'Clazz'    // clazz的Model名
// 	}]
// });
//
// var ClazzSchema = new mongoose.Schema({
// 	clazzName: String
// });
//
//
// // 模型
// var Student = mongoose.model('Student',StudentSchema);
// var Clazz = mongoose.model('Clazz',ClazzSchema);
//
//
// Clazz.create({clazzName: "喜洋洋一班"}, function(err, doc){
// 	if(err) return "插入数据失败";
//
// 	Student.create({name: "杨小帅", clazzID:[doc._id]}, function(err, student){
// 		if(err) return "插入数据失败";
// 	});
//
// });
//
//
// Student.find({}).populate("clazzID").exec(function(err, doc){
// 	console.log(doc[0].clazzID);
// });
//定义学生模式, 班级模式
var UserSchema = new mongoose.Schema({
    _id: Number,
	name: String
});

var RelationSchema = new mongoose.Schema({
    _id: Number,
    follor_user: {type: mongoose.Schema.ObjectId, ref: "User"},
    follored_user: {type: mongoose.Schema.ObjectId, ref: "User"}
});


UserSchema.statics.new = function (doc, _cb) {

    var Model = this;
    async.waterfall([
        function (callback) {
            CollectionsId.inicByCName(Model.modelName, function (err, id) {
                 callback(err, id)
            });
        },
        function (id, callback) {
            doc["_id"] = id;
            var entity = new Model(doc);
            entity.save(function (err, doc_) {
                callback(err, doc_);
            });
        }
    ], function (err, doc) {
        _cb(err, doc);
    });
};
UserSchema.pre("save", function (next) {
    console.log(this.name);
    next();
});

var User = mongoose.model("user", UserSchema);
var Relation = mongoose.model("relation", RelationSchema);

User.new({name: "杨小帅2"}, function (err, user) {
    console.log(err, user);
});
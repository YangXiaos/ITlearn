/**
 * Created by mryang on 17-8-12.
 */
var async = require('async');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/testIt');

function setIncId(schema, options) {
    schema.pre("save", function (next) {
        var doc = this;
        IncIdModel.incByCName(options.cName, function (err, _id) {
            doc._id = _id;
            next();
        });
    });
}


var IncIdSchema = new mongoose.Schema({
    _id: String,
    maxId: {type: Number, default: 0}
});

IncIdSchema.statics.incByCName = function (cName, cb) {
    this.findOneAndUpdate({_id: cName}, {$inc: {maxId: 1}}, function (err, doc) {
        cb(err, doc.maxId + 1);
    });
};

var userRef = {type: Number, ref: "user"};
var blogRef = {type: Number, ref: "blog"};

var UserSchema = new mongoose.Schema({
    _id: Number,
    name: String
});

var BlogSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    user: userRef,
    content: String,
    comments: [{type: Number, ref: "comment"}]
});

var CommentSchema = new mongoose.Schema({
    _id: Number,
    user: userRef,
    blog: blogRef,
    content: String
});

var MessageSchema = new mongoose.Schema({
    _id: Number,
    user: userRef,
    messageType: Number,
    content: mongoose.Schema.Types.Mixed
});


UserSchema.plugin(setIncId, {cName: "user"});
BlogSchema.plugin(setIncId, {cName: "blog"});
CommentSchema.plugin(setIncId, {cName: "comment"});
MessageSchema.plugin(setIncId, {cName: "message"});

UserSchema.pre("save", function (next) {
    var err = new Error("这是一个测试异常");
    next(err)
});

CommentSchema.post("save", function (comment) {
    console.log(this);
    console.log(comment);

    BlogModel.findOne({_id: comment.blog}, {user: 1})
        .exec(function (err, blog) {
            var message = new MessageModel({
                user: blog.user,
                messageType: 1,
                content: comment
            });
            message.save()
        });
});

var IncIdModel = mongoose.model("incId", IncIdSchema);
var UserModel = mongoose.model("user", UserSchema);
var BlogModel = mongoose.model("blog", BlogSchema);
var CommentModel = mongoose.model("comment", CommentSchema);
var MessageModel = mongoose.model("message", MessageSchema);


// 默认设置
var incIdList = ["user", "blog", "comment", "message"];
incIdList.forEach(function (cName) {
    IncIdModel.findOne({_id: cName}).then(function (doc) {
        if (!doc){
            new IncIdModel({_id: cName}).save();
        }
    })
});

// IncIdModel.find({}, function (err, IncList) {
//     console.log(IncList);
// });


// var person = new UserSchema({name: "杨小帅"});
// person.save();
//

UserModel.create({name: "dio"}, function (err, user) {
    console.log(err, user);
    UserModel.find({}, function (err, users) {
        console.log(err, users)
    })
});

UserModel.findOne({_id: 9998988})
    .then(function (data) {
        console.log();
    });

/*
* Create By mryang On 18-2-16
* 
*/

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/testIt');


var userRef = {type: Number, ref: "user"};
var blogRef = {type: Number, ref: "blog"};


var UserSchema = new mongoose.Schema({
    _id: Number,
    name: String
});

var BlogSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    user: {type: Number, ref: "user"},
    content: String,
    comments: [{type: Number, ref: "comment"}]
});

var CommentSchema = new mongoose.Schema({
    _id: Number,
    user: userRef,
    blog: blogRef,
    content: String
});

var User = mongoose.model("user", UserSchema);
var Blog = mongoose.model("blog", BlogSchema);
var Comment = mongoose.model("comment", CommentSchema);

// User.create({_id: 1, name: "喵喵喵"});
// Blog.create({_id: 1, title: "一首诗", user: 1, comments: []});
// Comment.create({_id: 1, user: 1, blog: 1, content: "这是遥远的评论"});
/*
Blog.updateOne({_id: 1}, {$push: {comments: 1}}, function (err, res) {
    console.log(err, res);
});
*/


Blog.find({}, "-__v").populate('user ', "-__v").exec(function (err, doc) {
    console.log(err, doc);
});

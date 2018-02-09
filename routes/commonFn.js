/*
* Create By mryang On 17-8-19
* 共享的路由函数, 用于验证用户等细节
*/


/**
 * 用户验证路由函数, 用于验证session 是否和请求一致
 * @param req
 * @param res
 * @param next
 */
var checkUserByBody = function (req, res, next) {
    if (req.session.user.isManager){
        next();
    } else if (req.session.user._id === req.body.user){
        next();
    } else {
        // 错误用户验证处理
    }
};


/**
 * 用户登录验证
 * @param req
 * @param res
 * @param next
 */
var checkIsLogin = function (req, res, next) {
    if (req.session.user){
        next()
    } else {
        //  用户不存在处理
    }
};


/**
 * 修改, 删除的用户验证
 * @param m 模型
 * @returns
 */
var checkUserByModel = function (m) {
    return function (req, res, next) {
        if (req.session.user.isManager) {
            next();
        } else {
            m.findOne(req.conditions, function (err, doc) {
                if (doc.user === req.session.user._id) {
                    next();
                } else {
                    // 用户不对应处理
                }
            });
        }
    };
};


/**
 * 检查是否为当前用户是否为管理员
 * @param req
 * @param res
 * @param next
 */
var checkManager = function (req, res, next) {
    if (req.session.user && req.session.user.isManager) {
        next();
    } else {
        // 发送异常结果
    }
};


/**
 * 设置post, patch方法的doc为 session中的user._id
 * @param req
 * @param res
 * @param next
 */
var setDocUser = function (req, res, next) {
    req.doc.user = req.session.user._id;
    next()
};


/**
 * 设置查询条件为session的user id
 * @type {checkIsLogin}
 */
var setConditionUser = function (req, res, next) {
    req.conditions.user = req.session.user._id;
    next()
};


module.exports.checkIsLogin = checkIsLogin;
module.exports.checkUserByBody = checkUserByBody;
module.exports.checkUserByModel = checkUserByModel;
module.exports.checkManager = checkManager;
module.exports.setDocUser = setDocUser;
module.exports.setConditionUser = setConditionUser;

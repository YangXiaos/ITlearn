/*
* Create By mryang On 17-8-19
* 工具验证函数
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
        next();
    } else {
        //  用户不存在处理
        res.status(401);
        res.json({status: 0, message: "用户未登录"});
    }
};


/**
 * 验证 model中的user, 是否为当前用户
 * 应用场景，用户修改文章描述，检查当前用户是否为管理员或
 * @param m model
 * @returns
 */
var checkUserByModel = function (m) {
    return function (req, res, next) {
        // 检查是否为管理员
        if (req.session.user.isManager) {
            next();
        } else {
            // 检查是否为模型队像中的user
            m.findOne(req.conditions, function (err, data) {
                if (!data){
                    // 用户不对应处理
                    res.status(401);
                    res.json({status: 0, message: "用户未登录"})
                } else if (data.user === req.session.user._id) {
                    next();
                } else {
                    // 用户不对应处理
                    res.status(401);
                    res.json({status: 0, message: "用户木有权限"})
                }
            });
        }
    };
};


/**
 * 检查session用户, 是否为管理员
 * @param req
 * @param res
 * @param next
 */
var checkIsManager = function (req, res, next) {
    if (req.session.user && req.session.user.isManager) {
        next();
    } else {
        // 发送异常结果
        res.status(401);
        res.json({status: 0, message: "用户木有权限"});
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
module.exports.checkIsManager = checkIsManager;
module.exports.setDocUser = setDocUser;
module.exports.setConditionUser = setConditionUser;

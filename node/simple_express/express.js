var mixin = require('merge-descriptors');
var proto = require('./application');

//创建 webserver
function createApplication() {
    var app  = function (req, res) {
        app.handle(req, res);    // 这是真正的服务器处理入口
    }
    mixin(app, proto, false);
    return app;
}
exports = module.exports = createApplication;
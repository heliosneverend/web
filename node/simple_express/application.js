var app = exports = module.exports = {};
app.listen = function listen() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
}
app.handle = function handle(req, res) {
    var router = this._router;
    //最终处理方法
    var done= finalhandler(req, res);
    //如果没有定义 router 直接结束返回
    if(!router) {
        done();
        return;
    }
    router.handle(req, res, done);
}
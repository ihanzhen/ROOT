$(function () {
    var wechatLoginPage = new WechatLoginPage();
    wechatLoginPage.init();
})
var WechatLoginPage = function () {
    var _this = this;
    _this.weichatLoginVM = {
        loginClick: function () {
            window.location.href = "http://hanzhendata.com/ihanzhendata/user/wxlogin";
        }
    };
    _this.init = function () {
        ko.applyBindings(_this.weichatLoginVM, $("#home-container")[0]);
    }
}
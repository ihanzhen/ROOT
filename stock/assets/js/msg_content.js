$(function () {
    var msgManagement = new MsgManagement();
    msgManagement.init();
})
var MsgManagement = function () {
    var _this = this;
    var msgVM = {
        title: ko.observable(''),
        content: ko.observable(''),
        updateTime: ko.observable('')
    };
    function getPageData() {
        window.stock.loading(true);
        $.post('/ihanzhendata/user/usermessage/' + localStorage.uid + '/' + _this.notifyId, function (data) {
            window.stock.loading(false);
            if (data && data.data) {
                var message = data.data;
                msgVM.title(message.notify_type);
                msgVM.content(message.notify_content);
                var arr = message.updatetime.split(/[- : ]/);
                var updateTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]).Format("YYYY-MM-DD");
                msgVM.updateTime(updateTime);
            } else {
                window.stock.logmsg(data);
            }
        });
    }
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        _this.notifyId = queryString.notifyId;
        ko.applyBindings(msgVM, $('#msg-container')[0]);
        getPageData();
    }
}

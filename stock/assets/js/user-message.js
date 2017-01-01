$(function () {
    var userMsgManagement = new UserMsgManagement();
    userMsgManagement.init();
})
var UserMsgManagement = function () {
    var _this = this;
    function Message(id, hasRead, title, updateTime, isCreateByMan) {
        this.notifyId = id;
        this.hasRead = ko.observable(hasRead);
        this.title = ko.observable(title);
        this.updateTime = ko.observable(updateTime);
        this.isCreateByMan = ko.observable(isCreateByMan);
        this.contentClick = function (item) {
            window.location.href = "msg_content.html?notifyId=" + item.notifyId;
        }
    }
    var viewModel = {
        items: ko.observableArray()
    }
    function getPageData() {
        window.stock.loading(true);
        $.get('http://hanzhendata.com/ihanzhendata/stock/notifies/' + localStorage.uid, function (data) {
            window.stock.loading(false);
            if (data && data.data && data.data.length > 0) {
                var messages = data.data;
                for (var i = 0; i < messages.length; i++) {
                    var id = messages[i].notify_id,
                        hasRead = Boolean(parseInt(messages[i].is_read)),
                        title = messages[i].notify_type,
                        isCreateByMan = messages[i].notify_title == "2" ? true : false;
                    var arr = messages[i].updatetime.split(/[- : ]/);
                    var updateTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]).Format("MM/DD");
                    viewModel.items.push(new Message(id, hasRead, title, updateTime, isCreateByMan));
                }
            }
        }).error(function () {
            window.stock.loading(false);
        });
    }
    _this.init = function () {
        ko.applyBindings(viewModel, $("#message-container")[0]);
        getPageData();
    }
}

$(function () {
    var noticeManagement = new NoticeManagement();
    noticeManagement.init();
})
function NoticeManagement() {
    _this = this;
    function Notice(text) {
        this.noticeText = ko.observable(text);
    };
    function ScroolViewModel() {
        var _this = this;
        _this.canVisible = ko.observable(true);
        _this.items = ko.observableArray([]);
        _this.closeClick = function () {
            _this.canVisible(false);
        }
    };
    _this.init = function () {
        _this.insertHtml();
        var scroolVM = new ScroolViewModel();
        ko.applyBindings(scroolVM, $('#scrollContainer')[0]);
        _this.getNoticeData(scroolVM);
        setInterval('_this.AutoScroll("#scrollDiv")', 4000);
    };
    _this.insertHtml = function () {
        var scroll = $('<div id="scrollContainer" class="am-alert am-alert-danger" data-am-alert style="margin-top:0px;margin-bottom:0px;border: 0 none;" data-bind="visible:canVisible"></div>');
        scroll.append('<button type="button" class="am-close" style="margin-top:-7px" data-bind="click:closeClick">&times;</button>');
        var div = $('<div id="scrollDiv" style="height: 15px;line-height: 25px;overflow: hidden;"></div>');
        var ul = $('<ul data-bind="foreach:items" style="list-style: none;text-align:left; margin: 0;padding: 0 !important;"></ul>');
        var li = $('<li style=" padding:0 0 0 10px; margin: -5px 0 0 0;"></li>');
        li.append($('<span class="am-icon-bell"></span>'));
        li.append($('<span style="margin-left:5px;" data-bind="text:noticeText"></span>'));
        ul.append(li);
        div.append(ul);
        scroll.append(div);
        $('header').after(scroll);
    }
    _this.AutoScroll = function (obj) {
        if ($(obj).find("li").length <= 1) {
            return;
        }
        $(obj).find("ul:first").animate({
            marginTop: "-25px"
        }, 500, function () {
            $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
        });
    };
    _this.positionAjax = function () {
        return $.get('/ihanzhendata/stock/market_forecast');
    };
    _this.noticeAjax = function () {
        return $.get('/ihanzhendata/stock/getoperation');
    };
    _this.getNoticeData = function (vm) {
        $.when(_this.positionAjax(), _this.noticeAjax()).done(function (position, notice) {
            var noticeData = notice[0].data;
            for (var i = 0; i < noticeData.length; i++) {
                vm.items.push(new Notice(noticeData[i].operation_content));
            }
            var dapanData = position[0].data;
            for (var i = 0; i < dapanData.length; i++) {
                if (dapanData[i].market_name == '综合仓位') {
                    var positionstr = ' 当前大盘建议仓位为' + dapanData[i].position / 10 + '成仓';
                    vm.items.push(new Notice(positionstr));
                }
            }
        });
    }
}

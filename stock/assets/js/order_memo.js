$(function () {
    //var store = $.AMUI.store;
    //if (!store.enabled) {
    //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
    //    return;
    //}
    //var token = localStorage.token, uid = localStorage.uid;
    //if (!token || !uid) {
    //    window.location.href = "login.html";
    //}
    //$('#my-modal-loading').modal('open');
    //$.post('/',
    //  { token: token, uid: uid },
    //  function (data, textStatus) {
    //      $('#my-modal-loading').modal('close');
    //      if (textStatus == "success") {
    //        
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });
    var markManagement = new MarkManagement();
    markManagement.init();
})
var MarkManagement = function () {
    var _this = this;
    _this.noticeVM = {
        notice:ko.observable('')
    }
    _this.markVM = {
        reasons: ['买入理由', '卖出理由'],
        selectedReason: ko.observable('买入理由'),
        hasSalePlan: ko.observable(false),
        buyReasonContent: ko.observable(''),
        saleReasonContent: ko.observable(''),
        salePlanContent: ko.observable(''),
        submitClick: function () {
            var selected = _this.markVM.selectedReason(), ajaxItem = { sorder_id: _this.sorderId, sorder_status: _this.status };
            if (selected == '买入理由') {
                if (_this.markVM.buyReasonContent() == '' && _this.markVM.hasSalePlan() == false) {
                    return;
                }
                ajaxItem.buy_reason = _this.markVM.buyReasonContent();

            } else if (selected == '卖出理由') {
                if (_this.markVM.saleReasonContent() == '' && _this.markVM.hasSalePlan() == false) {
                    return;
                }
                ajaxItem.sell_reason = _this.markVM.saleReasonContent();
            }
            if (_this.markVM.hasSalePlan()) {
                ajaxItem.sell_plan = _this.markVM.salePlanContent();
            }
            for (var prop in ajaxItem) {
                if (ajaxItem[prop].length > 200) {
                    _this.noticeVM.notice('标注内容请在200字以内');
                    $('#notice-alert').modal('open');
                    return;
                }
            }
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/stockOrderMn/addBuyAndSellPlan', ajaxItem, function (data) {
                $('#my-modal-loading').modal('close');
                $('#success-confirm').modal({
                    onConfirm: function () {
                        window.location.href = "moni.html?tab=tab5";
                    },
                    onCancel: function () {
                        window.location.href = "home.html";
                    }
                });
            }).error(function () {
                $('#my-modal-loading').modal('close');
            });
        }
    };
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        _this.sorderId = queryString.sorderId;
        _this.status = queryString.status;
        _this.getPageData();
        ko.applyBindings(_this.markVM, $("#mark-container")[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
    }
    _this.getPageData = function () {
        $('#my-modal-loading').modal('open');
        $.get('/ihanzhendata/stockOrderMn/querySorderPlan', { sorder_id: _this.sorderId, sorder_status: _this.status }, function (data) {
            $('#my-modal-loading').modal('close');
            _this.markVM.buyReasonContent(data.data.buy_reason);
            _this.markVM.saleReasonContent(data.data.sell_reason);
            _this.markVM.salePlanContent(data.data.sell_plan);
            if (data.data.sell_plan != '') {
                _this.markVM.hasSalePlan(true);
            }
        }).error(function () {
            $('#my-modal-loading').modal('close');
            console.log('Fail in getting page data');
        })
    };
}



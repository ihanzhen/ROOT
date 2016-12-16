$(function () {
    var stockDetailsPage = new StockDetailsPage();
    stockDetailsPage.init();
})
var StockDetailsPage = function () {
    var _this = this;
    _this.stockVM = {};
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.confirmVM = {
        select: ko.observable('1'),
        firstMark: ko.observable(''),
        secondMark: ko.observable(''),
        thirdMark: ko.observable(''),
        cancelClick: function () { },
        confirmClick: function () {
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/selfStock/saveSelfStock', {
                uid: localStorage.uid,
                stock_code: '600031.SH',
                stock_name: '三一重工',
                b_zx: _this.confirmVM.select()
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    _this.noticeVM.notice('添加自选成功！');
                    $('#notice-alert').modal('open');
                } else if (data.status == 12008) {
                    _this.noticeVM.notice('自选已存在，不用重复添加！');
                    $('#notice-alert').modal('open');
                }else {
                    _this.noticeVM.notice('添加自选失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                $('#my-modal-loading').modal('close');
                _this.noticeVM.notice('添加自选失败！');
                $('#notice-alert').modal('open');
            });
        }
    }
    //function StockVM() {
    //    this.flashClick = function () {
    //        window.location.href = "moni.html" + "?stockCode=601991";
    //    }
    //}
    _this.initHeader = function () {
        $("#addSelfSelect").click(function () {
            if (localStorage.s_zx1 != undefined && localStorage.s_zx2 != undefined && localStorage.s_zx3 != undefined) {
                _this.confirmVM.firstMark(localStorage.s_zx1);
                _this.confirmVM.secondMark(localStorage.s_zx2);
                _this.confirmVM.thirdMark(localStorage.s_zx3);
                $('#confirm-alert').modal();
            }
            else {
                $('#my-modal-loading').modal('open');
                $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) {
                    $('#my-modal-loading').modal('close');
                    if (data && data.data) {
                        var bzdata = data.data;
                        _this.confirmVM.firstMark(bzdata.s_zx1);
                        _this.confirmVM.secondMark(bzdata.s_zx2);
                        _this.confirmVM.thirdMark(bzdata.s_zx3);
                    }
                    $('#confirm-alert').modal();
                }).error(function () {
                    $('#my-modal-loading').modal('close');
                });
            }
        });
        //$('#flashBuy').click(function () {
        //    window.location.href = "moni.html" + "?stockCode=001155.SH";
        //});
    }
    _this.init = function () {
        ko.applyBindings(_this.stockVM, $('#stock-details')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        _this.initHeader();
    }
}



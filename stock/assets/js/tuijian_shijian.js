$(function () {
    var shijianManagement = new ShijianManagement();
    shijianManagement.init();
})
var ShijianManagement = function () {
    var _this = this;
    var shijianVM = {
        items: ko.observableArray([])
    }
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.confirmVM = {
        stockCode: '',
        stockName: '',
        select: ko.observable('1'),
        firstMark: ko.observable(''),
        secondMark: ko.observable(''),
        thirdMark: ko.observable(''),
        cancelClick: function () { },
        confirmClick: function () {
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/selfStock/saveSelfStock', {
                uid: localStorage.uid,
                stock_code: _this.confirmVM.stockCode,
                stock_name: _this.confirmVM.stockName,
                b_zx: _this.confirmVM.select()
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    _this.noticeVM.notice('添加自选成功！');
                    $('#notice-alert').modal('open');
                    shijianVM.items([]);
                    getStocksData();
                } else if (data.status == 12008) {
                    _this.noticeVM.notice('自选已存在，不用重复添加！');
                    $('#notice-alert').modal('open');
                } else {
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
    function Stock(sname, scode, logicName, isSelfSelect) {
        this.sname = ko.observable(sname);
        this.scode = ko.observable(scode);
        this.logicName = ko.observable(logicName);
        this.isSelfSelect = ko.observable(isSelfSelect);
        this.redirectClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
        this.selectClick = function (item) {
            if (item.isSelfSelect()) {
                $('#my-modal-loading').modal('open');
                $.ajax({
                    url: '/ihanzhendata/selfStock/deleteSelfStock',
                    method: 'POST',
                    data: {
                        uid: localStorage.uid,
                        stock_code: item.scode()
                    },
                    success: function (result) {
                        $('#my-modal-loading').modal('close');
                        if (result && result.status == 1) {
                            _this.noticeVM.notice('自选股删除成功！');
                            $('#notice-alert').modal('open');
                            shijianVM.items([]);
                            getStocksData();
                        } else {
                            _this.noticeVM.notice('自选股删除失败！');
                            $('#notice-alert').modal('open');
                        }
                    },
                    error: function () {
                        $('#my-modal-loading').modal('close');
                        _this.noticeVM.notice('自选股删除失败！');
                        $('#notice-alert').modal('open');
                    }
                });
            } else {
                _this.confirmVM.stockCode = item.scode();
                _this.confirmVM.stockName = item.sname();
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
            }
        }
        //this.change = ko.observable(change);
        //this.value = ko.observable(value);
    }
    function getStocksData() {
        $('#my-modal-loading').modal('open');
        $.get('/ihanzhendata/logicstocks/' + localStorage.uid, function (data) {
            $('#my-modal-loading').modal('close');
            if (data && data.status == 1) {
                var stocks = data.data;
                for (var i = 0; i < stocks.length; i++) {
                    shijianVM.items.push(new Stock(stocks[i].stock_name, stocks[i].stock_code, stocks[i].logic_name, Boolean(parseInt(stocks[i].is_zxg))));
                }
            }
        }).error(function () {
            $('#my-modal-loading').modal('close');
        });
    }
    _this.init = function () {
        ko.applyBindings(shijianVM, $('#shijian-container')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        getStocksData();
    }
}
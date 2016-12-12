$(function () {
    var tradeManagement = new TradeManagement();
    tradeManagement.init();
})
function TradeManagement() {
    var _this = this;
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.settingVM = {
        firstMark: ko.observable(''),
        secondMark: ko.observable(''),
        thirdMark: ko.observable(''),
        confirmClick: function () {
            $('#my-modal-loading').modal();
        }
    }
    _this.tradeVM = new TradeVM();
    function TradeVM() {
        var _vm = this;
        _vm.tab = {
            firstRemark: ko.observable(''),
            secondRemark: ko.observable(''),
            thirdRemark: ko.observable(''),
            selectOneClick: function () {
                _vm.firstStocks([]);
                _this.getSelfStock(1);
            },
            selectTwoClick: function () {
                _vm.secondStocks([]);
                _this.getSelfStock(2);
            },
            selectThreeClick: function () {
                _vm.thirdStocks([]);
                _this.getSelfStock(3);
            }
        };
        _vm.firstStocks = ko.observableArray([]);
        _vm.secondStocks = ko.observableArray([]);
        _vm.thirdStocks = ko.observableArray([]);
    }
    function Stock(scode, sname, price, priceChange, valuation, isSelect, isRecommend, isValuable, trend) {
        this.scode = ko.observable(scode);
        this.sname = ko.observable(sname);
        this.price = ko.observable(price);
        this.priceChange = ko.observable(priceChange);
        this.valuation = ko.observable(valuation);
        this.isSelect = ko.observable(isSelect);
        this.isRecommend = ko.observable(isRecommend);
        this.isValuable = ko.observable(isValuable);
        this.trend = ko.observable(trend);
        this.detailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode();
        };
        this.deleteClick = function (item) {
            $('#my-modal-loading').modal('open');
            $.ajax({
                url: '/ihanzhendata/selfStock/deleteSelfStock',
                type: 'DELETE',
                data:{
                    uid: localStorage.uid,
                    stock_code:item.scode()
                },
                success: function (result) {
                    $('#my-modal-loading').modal('close');
                    if (result && result.status == 1) {
                        _this.noticeVM.notice('自选股删除成功！');
                        $('#notice-alert').modal('open');
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
        }
    };
    _this.init = function () {
        //_this.tradeVM.firstStocks.push(new Stock('000656.SH', '金科股份', 3058.51, +26.12, 'A+', true, true, true, '看空'));
        //_this.tradeVM.secondStocks.push(new Stock('000656.SH', '金科股份', 3058.51, +26.12, 'A+', true, true, true, '看空'));
        //_this.tradeVM.thirdStocks.push(new Stock('000656.SH', '金科股份', 3058.51, +26.12, 'A+', true, true, true, '看空'));
        ko.applyBindings(_this.tradeVM, $('#trade-container')[0]);
        ko.applyBindings(_this.settingVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        _this.initHeader();
    };
    _this.getSelfStock = function (belongzx) {
        $('#my-modal-loading').modal('open');
        $.get('', {
            uid: localStorage.uid,
            b_zx: belongzx
        }, function (data) {
            $('#my-modal-loading').modal('close');
            if (data && data.data) {
                var stockArr = data.data;
                for (var i = 0; i < stockArr.length; i++)
                    switch (belongzx) {
                        case 1: _vm.firstStocks.push(new Stock(stockArr[i].stock_code, stockArr[i].stock_name, '', '', stockArr[i].headstock_value), stockArr[i].is_zxg, stockArr[i].is_tjg, stockArr[i].is_jzg, '看？'); break;
                        case 2: _vm.secondStocks.push(new Stock(stockArr[i].stock_code, stockArr[i].stock_name, '', '', stockArr[i].headstock_value), stockArr[i].is_zxg, stockArr[i].is_tjg, stockArr[i].is_jzg, '看？');break;
                        case 3: _vm.thirdStocks.push(new Stock(stockArr[i].stock_code, stockArr[i].stock_name, '', '', stockArr[i].headstock_value),stockArr[i].is_zxg,stockArr[i].is_tjg,stockArr[i].is_jzg,'看？'); break;
                            //Stock(scode, sname, price, priceChange, valuation, isSelect, isRecommend, isValuable, trend)
                    }
            }
        })
    };
    _this.initHeader = function () {
        $("searchBtn").click(function () {
            window.location.href = "search.html";
        });
        $("#refreshBtn").click(function () {
            window.location.reload();
        });
        $("#settingBtn").click(function () {
            $('#my-modal-loading').modal('open');
            $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data && data.data) {
                    _this.settingVM.firstMark(data.data.s_zx1);
                    _this.settingVM.secondMark(data.data.s_zx2);
                    _this.settingVM.thirdMark(data.data.s_zx3);
                }
                $("#confirm-alert").modal({
                    onConfirm: function () {
                        $('#my-modal-loading').modal('open');
                        $.post('/ihanzhendata/selfStock/updateSelfStockBz', {
                            uid: localStorage.uid,
                            s_zx1: _this.settingVM.firstMark(),
                            s_zx2: _this.settingVM.secondMark(),
                            s_zx3: _this.settingVM.thirdMark()
                        }, function (data) {
                            $('#my-modal-loading').modal('close');
                            if (data.status == 1) {
                                _this.noticeVM.notice('备注保存成功！');
                                $('#notice-alert').modal('open');
                            }
                            else {
                                _this.noticeVM.notice('备注保存失败！');
                                $('#notice-alert').modal('open');
                            }
                        }).error(function () {
                            _this.noticeVM.notice('备注保存失败！');
                            $('#notice-alert').modal('open');
                        });
                    },
                    onCancel: function () {
                    }
                })
            });

        });
    }
}
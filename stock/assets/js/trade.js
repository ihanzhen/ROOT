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
            var bz1 = _this.settingVM.firstMark(),
                bz2 = _this.settingVM.secondMark(),
                bz3 = _this.settingVM.thirdMark();
            if (bz1 == "" && bz2 == "" && bz3 == "") {
                return;
            }
            if (bz1.length > 7 || bz2.length > 7 || bz3.length > 7) {
                _this.noticeVM.notice('备注最多为7个字！');
                $('#notice-alert').modal('open');
                return;
            }
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/selfStock/updateSelfStockBz', {
                uid: localStorage.uid,
                s_zx1: bz1,
                s_zx2: bz2,
                s_zx3: bz3
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    _this.noticeVM.notice('备注保存成功！');
                    $('#notice-alert').modal('open');
                    localStorage.s_zx1 = bz1;
                    localStorage.s_zx2 = bz2;
                    localStorage.s_zx3 = bz3;
                    _this.tradeVM.tab.firstRemark(bz1);
                    _this.tradeVM.tab.secondRemark(bz2);
                    _this.tradeVM.tab.thirdRemark(bz3);
                }
                else {
                    _this.noticeVM.notice('备注保存失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                _this.noticeVM.notice('备注保存失败！');
                $('#notice-alert').modal('open');
            });
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
                _this.getSelfStockWholeProcess(1);
            },
            selectTwoClick: function () {
                _vm.secondStocks([]);
                _this.getSelfStockWholeProcess(2);
            },
            selectThreeClick: function () {
                _vm.thirdStocks([]);
                _this.getSelfStockWholeProcess(3);
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
                data: {
                    uid: localStorage.uid,
                    stock_code: item.scode()
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
        _this.initPageData();
        _this.initHeader();
    };
    _this.getSelfStockWholeProcess = function (belongzx) {
        $('#my-modal-loading').modal('open');
        $.when(_this.getSelfStock(belongzx)).done(function (stockData) {
            $('#my-modal-loading').modal('close');
            if (stockData.status == 1) {
                _this.processStockData(stockData);
            }
        });
    }
    _this.getSelfStock = function (belongzx) {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/selfStock/getSelfStock', {
            uid: localStorage.uid,
            b_zx: belongzx,
            pageNumber: 1
        }, function (data) { });
    };
    _this.processStockData = function (stockArr) {
        for (var i = 0; i < stockArr.length; i++)
            switch (belongzx) {
                case 1: _vm.firstStocks.push(new Stock(stockArr[i].stock_code, stockArr[i].stock_name, '', '', stockArr[i].headstock_value), stockArr[i].is_zxg, stockArr[i].is_tjg, stockArr[i].is_jzg, '看？'); break;
                case 2: _vm.secondStocks.push(new Stock(stockArr[i].stock_code, stockArr[i].stock_name, '', '', stockArr[i].headstock_value), stockArr[i].is_zxg, stockArr[i].is_tjg, stockArr[i].is_jzg, '看？'); break;
                case 3: _vm.thirdStocks.push(new Stock(stockArr[i].stock_code, stockArr[i].stock_name, '', '', stockArr[i].headstock_value), stockArr[i].is_zxg, stockArr[i].is_tjg, stockArr[i].is_jzg, '看？'); break;
                    //Stock(scode, sname, price, priceChange, valuation, isSelect, isRecommend, isValuable, trend)
            }
    }
    _this.initPageData = function () {
        $('#my-modal-loading').modal('open');
        $.when(_this.getSelfBz(), _this.getSelfStock(1)).done(function (beizhuData, stockData) {
            $('#my-modal-loading').modal('close');
            if (beizhuData && beizhuData[0].data) {
                var bzdata = beizhuData[0].data;
                localStorage.s_zx1 = bzdata.s_zx1;
                localStorage.s_zx2 = bzdata.s_zx2;
                localStorage.s_zx3 = bzdata.s_zx3;
                _this.tradeVM.tab.firstRemark(localStorage.s_zx1);
                _this.tradeVM.tab.secondRemark(localStorage.s_zx2);
                _this.tradeVM.tab.thirdRemark(localStorage.s_zx3);
            }
            if (stockData && stockData[0].data) {
                _this.processStockData(stockData[0].data);
            }
        });
    }
    _this.getSelfBz = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) { });
    }
    _this.initHeader = function () {
        $("searchBtn").click(function () {
            window.location.href = "search.html";
        });
        $("#refreshBtn").click(function () {
            window.location.reload();
        });
        $("#settingBtn").click(function () {
            _this.settingVM.firstMark(localStorage.s_zx1);
            _this.settingVM.secondMark(localStorage.s_zx2);
            _this.settingVM.thirdMark(localStorage.s_zx3);
            $("#confirm-alert").modal();
        });
    }
}
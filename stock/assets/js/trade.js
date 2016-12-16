$(function () {
    var tradeManagement = new TradeManagement();
    tradeManagement.init();
})
function TradeManagement() {
    var _this = this;
    //var timeout;
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.mousedownVM = {
        stockObj: {
            scode: ko.observable(''),
            sname: ko.observable(''),
            whichzx: 0,
            movea: ko.observable(),
            moveb:ko.observable()
        },
        deleteClick: function () {
            $('#mousedown-alert').modal('close');
            $('#my-modal-loading').modal('open');
            $.ajax({
                url: '/ihanzhendata/selfStock/deleteSelfStock',
                method: 'POST',
                data: {
                    uid: localStorage.uid,
                    stock_code: _this.mousedownVM.stockObj.scode()
                },
                success: function (result) {
                    $('#my-modal-loading').modal('close');
                    if (result && result.status == 1) {
                        _this.noticeVM.notice('自选股删除成功！');
                        $('#notice-alert').modal('open');
                        switch (_this.mousedownVM.stockObj.whichzx) {
                            case 1: _this.tradeVM.tab.selectOneClick(); break;
                            case 2: _this.tradeVM.tab.selectTwoClick(); break;
                            case 3: _this.tradeVM.tab.selectThreeClick(); break;
                        }
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
        },
        moveClick: function (moveto, data, event) {
            $('#mousedown-alert').modal('close');
            var b_zx='';
            if (moveto == 'a') {
                b_zx = _this.mousedownVM.stockObj.movea();
            } else if (moveto == 'b') {
                b_zx = _this.mousedownVM.stockObj.moveb();
            }
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/selfStock/updateSelfStockB_zx', {
                uid: localStorage.uid,
                stock_code: _this.mousedownVM.stockObj.scode(),
                b_zx: b_zx
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    _this.noticeVM.notice('移动自选股成功！');
                    $('#notice-alert').modal('open');
                    switch (_this.mousedownVM.stockObj.whichzx) {
                        case 1: _this.tradeVM.tab.selectOneClick(); break;
                        case 2: _this.tradeVM.tab.selectTwoClick(); break;
                        case 3: _this.tradeVM.tab.selectThreeClick(); break;
                    }
                } else {
                    _this.noticeVM.notice('移动自选股失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                $('#my-modal-loading').modal('close');
                _this.noticeVM.notice('移动自选股失败！');
                $('#notice-alert').modal('open');
            });
        },
        settopClick:function(){
            //to do....置顶
           
        }
    }
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
    function Stock(scode, sname, price, priceChange, valuation, isSelect, isRecommend, isValuable, trend,which) {
        this.scode = ko.observable(scode);
        this.sname = ko.observable(sname);
        this.price = ko.observable(price);
        this.priceChange = ko.observable(priceChange);
        this.valuation = ko.observable(valuation);
        this.isSelect = ko.observable(isSelect);
        this.isRecommend = ko.observable(isRecommend);
        this.isValuable = ko.observable(isValuable);
        this.trend = ko.observable(trend);
        this.whichzx = which;
        this.stockMouseDown = function (data, event) {
            event.preventDefault();
            _this.mousedownVM.stockObj.sname(data.sname());
            _this.mousedownVM.stockObj.scode(data.scode());
            _this.mousedownVM.stockObj.whichzx = data.whichzx;
            switch (data.whichzx) {
                case 1: _this.mousedownVM.stockObj.movea(2); _this.mousedownVM.stockObj.moveb(3); break;
                case 2: _this.mousedownVM.stockObj.movea(1); _this.mousedownVM.stockObj.moveb(3); break;
                case 3: _this.mousedownVM.stockObj.movea(1); _this.mousedownVM.stockObj.moveb(2); break;
            }
            $('#mousedown-alert').modal();
            $('.am-header-title').click();
            //timeout = setTimeout(function () {
            //    //to do....
               
            //}, 0);
            return false;
        },
        this.stockMouseOut = function (data, event) {
           // clearTimeout(timeout);
        },
        this.stockMouseUp = function (data, event) {
           // clearTimeout(timeout);
        },
        this.detailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode();
        };
        this.touchStart = function (data, event) {
            event.preventDefault();
        }
    };
    _this.init = function () {
        ko.applyBindings(_this.tradeVM, $('#trade-container')[0]);
        ko.applyBindings(_this.settingVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        ko.applyBindings(_this.mousedownVM, $('#mousedown-alert')[0]);
        _this.initPageData();
        _this.initEvent();
    };
    _this.getSelfStockWholeProcess = function (belongzx) {
        $('.loadspan').show();
        $.when(_this.getSelfStock(belongzx)).done(function (stockData) {
            if (stockData.status == 1) {
                _this.processStockData(stockData.data, belongzx);
            }
        });
    }
    _this.getSelfStock = function (belongzx) {
        $('.loadspan').show();
        return $.get('/ihanzhendata/selfStock/getSelfStock', {
            uid: localStorage.uid,
            b_zx: belongzx,
            pageNumber: 1
        }, function (data) { });
    };
    _this.processStockData = function (stockArr, belongzx) {
        if (stockArr.length > 0) {
            var parameterArr = [];
            for (var i = 0; i < stockArr.length; i++) {
                parameterArr.push('s_' + stockArr[i].stock_code.substring(7, 9).toLowerCase() + stockArr[i].stock_code.substring(0, 6));
            }
            //获取实时数据,与后台获取数据组合,拼成自选页下面的列表
            var parameterStr = parameterArr.join(',');
            var url = 'http://hq.sinajs.cn/list=' + parameterStr;
            $.ajax({
                cache: true,
                url: url,
                type: 'GET',
                dataType: 'script',
                timeout: 2000,
                success: function (data, textStatus, jqXHR) {
                    var resultArr = [];//二维数组
                    for (var i = 0; i < parameterArr.length; i++) {
                        resultArr[i] = eval('hq_str_' + parameterArr[i]).split(',');
                    }
                    for (var j = 0; j < resultArr.length; j++) {
                        var scode = stockArr[j].stock_code,
                            sname = stockArr[j].stock_name,
                            currentPrice = resultArr[j][1],
                            priceChange = resultArr[j][2],
                            valuation = stockArr[j].headstock_value,
                            isSelect = Boolean(parseInt(stockArr[j].is_zxg)),
                            isRecommend = Boolean(parseInt(stockArr[j].is_tjg)),
                            isValuable = Boolean(parseInt(stockArr[j].is_jzg)),
                            trend = '';
                        switch (belongzx) {
                            case 1: _this.tradeVM.firstStocks.push(new Stock(scode, sname, currentPrice, priceChange, valuation, isSelect, isRecommend, isValuable, trend, belongzx)); break;
                            case 2: _this.tradeVM.secondStocks.push(new Stock(scode, sname, currentPrice, priceChange, valuation, isSelect, isRecommend, isValuable, trend, belongzx)); break;
                            case 3: _this.tradeVM.thirdStocks.push(new Stock(scode, sname, currentPrice, priceChange, valuation, isSelect, isRecommend, isValuable, trend, belongzx)); break;
                                //Stock(scode, sname, price, priceChange, valuation, isSelect, isRecommend, isValuable, trend)
                        }
                    }
                    $('.loadspan').hide();
                }
            }).error(function () {
                $('.loadspan').hide();
            });
        } else {
            $('.loadspan').hide();
        }
    }
    _this.initPageData = function () {
        $('#my-modal-loading').modal('open');
        $('.loadspan').show();
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
                _this.processStockData(stockData[0].data, 1);
            }
        });
    }
    _this.getSelfBz = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) { });
    }
    _this.initEvent = function () {
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
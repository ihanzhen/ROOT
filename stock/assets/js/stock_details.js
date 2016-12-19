$(function () {
    var stockDetailsPage = new StockDetailsPage();
    stockDetailsPage.init();
})
var StockDetailsPage = function () {
    var _this = this;
    var stockCode = "";
    var stockName = "";
    var stockVM = {
        stars: ko.observable(0),
        boards: ko.observable(''),
        yesterdayValue: ko.observable(''),
        debtAssets: ko.observable(''),
        currentIncome: ko.observable(''),
        priceearning: ko.observable(''),
        lastYearTotalIncome: ko.observable('')
    };
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
                stock_code: stockCode,
                stock_name: stockName,
                b_zx: _this.confirmVM.select()
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    _this.noticeVM.notice('添加自选成功！');
                    $('#notice-alert').modal('open');
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
    function unicode2Chr(str) {
        return unescape(str.replace(/\\/g, "%"))
    }
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
        $('#flashBuy').click(function () {
            window.location.href = "moni.html?stockCode=" + stockCode + "&stockName=" + stockName;
        });
    }
    _this.getStockData = function () {
        $('#my-modal-loading').modal('open');
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksbasic/' + stockCode,
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) { }
        });
    }
    _this.initPageData = function () {
        $.when(_this.getStockData()).done(function (stockData) {
            $('#my-modal-loading').modal('close');
            if (stockData && stockData.data) {
                var stock = stockData.data;
                stockVM.stars(stock.stars);
                var boardStr = stock.boards.substring(1, stock.boards.length - 1);
                var boardArr = boardStr.split(',');
                var arr = [];
                for (var i = 0; i < boardArr.length; i++) {
                    if (boardArr[i]) {
                        arr.push(unicode2Chr(boardArr[i].substring(2, boardArr[i].length - 1)));
                    }
                }
                stockVM.boards(arr.join(","));
                stockVM.yesterdayValue((stock.ev / 100000000).toFixed(2) + '亿');
                stockVM.debtAssets((stock.debt_assets).toFixed(2) + '%');
                stockVM.currentIncome((stock.or / 100000000).toFixed(2) + '亿');
                stockVM.priceearning((stock.pe).toFixed(2));
                //处理图标数据
                option.series[0].data = stock.roe_basic;
                myChart = echarts.init(document.getElementById('main'));
                myChart.setOption(option);
                option1.series[0].data = stock.gross_pro_mg;
                myChart = echarts.init(document.getElementById('main1'));
                myChart.setOption(option1);
                option2.series[0].data = stock.oper_cash_ps;
                myChart = echarts.init(document.getElementById('main2'));
                myChart.setOption(option2);
                option3.series[0].data = stock.wgsd;
                myChart = echarts.init(document.getElementById('main3'));
                myChart.setOption(option3);
                option4.series[0].data = stock.oper_tr;
                myChart = echarts.init(document.getElementById('main4'));
                myChart.setOption(option4);
                option5.series[0].data = stock.profit;
                myChart = echarts.init(document.getElementById('main5'));
                myChart.setOption(option5);
            }
        })
    }
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        stockCode = queryString.stockCode;
        stockName = queryString.stockName;
        $('#stockCode').text(stockCode);
        $('#stockName').text(stockName);
        ko.applyBindings(stockVM, $('#stockdetails-container')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        _this.initHeader();
        _this.initPageData();
    }

}



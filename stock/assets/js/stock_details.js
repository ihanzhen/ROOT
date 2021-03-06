﻿$(function () {
    var stockDetailsPage = new StockDetailsPage();
    stockDetailsPage.init();
})
var StockDetailsPage = function () {
    var _this = this;
    var stockCode = "";
    var stockName = "";
    function SalesConsist(consistName, percentage) {
        this.consistName = ko.observable(consistName),
        this.percentage = ko.observable(percentage)
    }
    var stockVM = {
        stars: ko.observable(0),
        proposal:ko.observable(''),
        boards: ko.observable(''),
        yesterdayValue: ko.observable(''),
        debtAssets: ko.observable(''),
        currentIncome: ko.observable(''),
        priceearning: ko.observable(''),
        lastYearTotalIncome: ko.observable(''),
        introduce: ko.observable(''),
        items:ko.observableArray([])
    };
    function unicode2Chr(str) {
        return unescape(str.replace(/\\/g, "%"))
    }
    function date2quarter(date) {
        var mydate = new Date(date);
        var month = mydate.getMonth() + 1;
        var quarter = '';
        switch (month) {
            case 3: quarter = '1'; break;
            case 6: quarter = '2'; break;
            case 9: quarter = '3'; break;
            case 12: quarter = '4'; break;
        }
        if (quarter == '') {
            console.log('error occurs in processing quarter date from api');
        } else {
            return quarter;
        }
    }
    _this.initHeader = function () {
        $("#addSelfSelect").click(function () {
            confirmVM.stockCode = stockCode;
            confirmVM.stockName = stockName;
            if (localStorage.s_zx1 != undefined && localStorage.s_zx2 != undefined && localStorage.s_zx3 != undefined) {
                confirmVM.firstMark(localStorage.s_zx1);
                confirmVM.secondMark(localStorage.s_zx2);
                confirmVM.thirdMark(localStorage.s_zx3);
                $('#confirm-alert').modal();
            }
            else {
                $('#my-modal-loading').modal('open');
                $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) {
                    $('#my-modal-loading').modal('close');
                    if (data && data.data) {
                        var bzdata = data.data;
                        confirmVM.firstMark(bzdata.s_zx1);
                        confirmVM.secondMark(bzdata.s_zx2);
                        confirmVM.thirdMark(bzdata.s_zx3);
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
    _this.getProposal=function(){
        window.stock.loading(true);
        return $.get('/ihanzhendata/logicstocks/' + stockCode + '/details', function (data) {
        });
    }
    _this.initPageData = function () {
        window.stock.loading(true);
        $.when(_this.getStockData(), _this.getProposal()).done(function (stockData, proposal) {
            $('#my-modal-loading').modal('close');
            if (stockData && stockData[0].data) {
                var stock = stockData[0].data;
                stockVM.stars(stock.stars);
                var boardArr = stock.boards.split(';');
                stockVM.boards(stock.boards);
                stockVM.yesterdayValue((stock.ev / 100000000).toFixed(2) + '亿');
                stockVM.debtAssets((stock.debt_assets).toFixed(2) + '%');
                stockVM.currentIncome((stock.or / 100000000).toFixed(2) + '亿');
                stockVM.priceearning((stock.pe).toFixed(2));
                stockVM.lastYearTotalIncome((stock.or_lastyear / 100000000).toFixed(2) + '亿');
                stockVM.introduce(stock.intro);
                if (stock.seg_sales) {
                    var consistArr = stock.seg_sales.split(";");
                    for (var i = 0; i < consistArr.length; i++) {
                        var part = consistArr[i].split(':');
                        stockVM.items.push(new SalesConsist(part[0], part[1]));
                    }
                } else {
                    stockVM.items.push(new SalesConsist('暂无数据', ''));
                }
                //处理图表数据
                var quarterArr = [];
                for (var i = 0; i < stock.quarter.length; i++) {
                    quarterArr.push(date2quarter(stock.quarter[i]));
                }
                option.series[0].data = stock.roe_basic;
                myChart = echarts.init(document.getElementById('main'));
                myChart.setOption(option);
                option1.series[0].data = stock.gross_pro_mg;
                myChart = echarts.init(document.getElementById('main1'));
                myChart.setOption(option1);
                option2.series[0].data = stock.oper_cash_ps;
                option2.xAxis[0].data = quarterArr;
                myChart = echarts.init(document.getElementById('main2'));
                myChart.setOption(option2);
                option3.series[0].data = stock.wgsd;
                option3.xAxis[0].data = quarterArr;
                myChart = echarts.init(document.getElementById('main3'));
                myChart.setOption(option3);
                option4.series[0].data = stock.oper_tr;
                option4.xAxis[0].data = quarterArr;
                myChart = echarts.init(document.getElementById('main4'));
                myChart.setOption(option4);
                option5.series[0].data = stock.profit;
                option5.xAxis[0].data = quarterArr;
                myChart = echarts.init(document.getElementById('main5'));
                myChart.setOption(option5);
            }
            if (proposal && proposal[0].data) {
                stockVM.proposal(proposal[0].data.descript);
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
        _this.initHeader();
        _this.initPageData();
    }

}



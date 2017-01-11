//require.config({
//    path: {
//        "jquery": "jquery.min",
//        "amazeui": "amazeui.min",
//        "knockout": "knockout-3.1.0",
//        "dp_index": "dp_index",
//        "notice": "notice",
//        "common": "common",
//        "": "",
//        "": "",
//        "": "",
//    }
//});
//require(["jquery", "amazeui.min", "knockout"], function ($) {

//});

$(function () {
    var dapanManagement = new DapanManagement();
    dapanManagement.init();
})
var DapanManagement = function () {
    var _this = this;
    _this.init = function () {
        _this.dapanVM = new DapanVM();
        ko.applyBindings(_this.dapanVM, $("#dapan-container")[0]);
        _this.getPageData();
        var int = self.setInterval(_this.updatePriceAsync, Math.ceil(Math.random() * 5) * 1000);
    }
    //view model
    var Market = function (price, name, property, position, oldPrice) {
        this.price = ko.observable(price);
        this.marketName = ko.observable(name);
        this.property = ko.observable(property);
        this.position = ko.observable(position);
        this.oldPrice = ko.observable(oldPrice);
    }
    var DapanVM = function () {
        _vm = this;
        _vm.items = ko.observableArray([]);
        _vm.proposalPredictionsVM = {
            position: ko.observable(''),
            prediction: ko.observable('')
        };
    }
    _this.dapanAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/stock/market_forecast');
    }
    _this.proposalPredictionAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/stock/main_position');
    }
    _this.getPrice = function (datastr, nth) {
        return parseFloat(datastr.split(',')[nth]).toFixed(2);
    }
    _this.updatePriceAsync = function () {
        var index = Math.floor(Math.random() * 3);
        var url = '', datastr;
        switch (index) {
            case 0: url = "http://hq.sinajs.cn/list=sh000001"; datastr = hq_str_sh000001; break;
            case 1: url = "http://hq.sinajs.cn/list=sz399905"; datastr = hq_str_sz399905; break;
            case 2: url = "http://hq.sinajs.cn/list=sz399006"; datastr = hq_str_sz399006; break;
        }
        $.ajax({
            cache: true,
            url: url,
            type: 'GET',
            dataType: 'script',
            timeout: 2000,
            success: function (data, textStatus, jqXHR) {
                var arr = [];
                arr.push(_this.getPrice(datastr, 3));
                arr.push(_this.getPrice(datastr, 1));
                if (arr[0] != _this.dapanVM.items()[index].price()) {
                    $($('.zhishuNum')[index]).css('background-color', '#444');
                    setTimeout(function () {
                        $($('.zhishuNum')[index]).css('background-color', '#3d3d3d');
                    }, 500);
                    _this.dapanVM.items()[index].price(arr[0]);
                    _this.dapanVM.items()[index].oldPrice(arr[1]);
                }
            }
        });
    }
    _this.queryUserAsset = function () {//资产情况
        return $.get('/ihanzhendata/stockOrderMn/queryUserAsset', { uid: localStorage.uid }, function (data) { });
    }
    _this.getTendencyAjax = function (zhishutype, righttype) {
        window.stock.loading(true);
        var windcode = "";
        switch (zhishutype) {
            case 1: windcode = '000001.SH'; break;
            case 2: windcode = '399905.SZ'; break;
            case 3: windcode = '399006.SZ'; break;
        }
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksindex/?num=18&type=&windcode=' + windcode,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                if (data && data.data && data.data.data) {
                    var closePriceArr = data.data.data;
                    computeSvgGraph(closePriceArr, zhishutype, righttype);
                }

            }
        });
    }
    _this.getLoopGainRatio = function () {
        $.get('/ihanzhendata/stock/looplv', { uid: localStorage.uid }, function (data) {
            if (data.status == 1) {
                var loopGainRatio = parseInt(data.data.looplv);
                option_1.series[0].data[0].value = loopGainRatio;
                option_1.series[0].data[1].value = 100 - loopGainRatio;
                myChart = echarts.init(document.getElementById('main-1'));
                myChart.setOption(option_1);
            }
        });
    }
    function getIndexAjax(type) {
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksindex/?num=17&type=' + type,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {}
        });
    }
    _this.getIndexGraphData = function () {
        $.when(getIndexAjax('FUND'), getIndexAjax('Strong'), getIndexAjax('Ready')).done(function (fund, strong, ready) {
            if (fund[0].data) {
                option.series[0].data = fund[0].data.data;
            }
            if (strong[1].data) {
                option.series[0].data = strong[0].data.data;
            }
            if (ready[0].data) {
                option.series[2].data = ready[0].data.data;
            }
            option.xAxis[0].data = ["12/24", "12/25", "12/26", "12/27", "12/28", "12/29", "12/30", "12/31", "1/01", "1/02", "1/03",
            "1/04", "1/05", "1/06", "1/07", "1/08", "1/09"];
            option.grid.left = "0";
            myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(option);
        });
    }
    _this.getPageData = function () {
        $('#my-modal-loading').modal('open');
        var closePrice = [];
        var openPrice = [];
        closePrice.push(_this.getPrice(hq_str_sh000001, 3));
        closePrice.push(_this.getPrice(hq_str_sz399905, 3));
        closePrice.push(_this.getPrice(hq_str_sz399006, 3));
        openPrice.push(_this.getPrice(hq_str_sh000001, 1));
        openPrice.push(_this.getPrice(hq_str_sz399905, 1));
        openPrice.push(_this.getPrice(hq_str_sz399006, 1));
        $.when(_this.dapanAjax(), _this.proposalPredictionAjax(), _this.queryUserAsset(), _this.getTendencyAjax(1, 1), _this.getLoopGainRatio(),
            _this.getTendencyAjax(2, 2), _this.getTendencyAjax(3, 3), _this.getIndexGraphData())
            .done(function (dapanResult, proposalResult, asset) {
                $('#my-modal-loading').modal('close');
                var dapanData = dapanResult[0].data;
                var dapanArr = [];
                for (var i = 0; i < dapanData.length; i++) {
                    if (dapanData[i].market_name == '综合仓位') {
                        option_2.series[0].data[0].value = dapanData[i].position;
                        option_2.series[0].data[1].value = 100 - dapanData[i].position;
                        myChart = echarts.init(document.getElementById('main-2'));
                        myChart.setOption(option_2);
                    } else {
                        dapanArr.push(dapanData[i]);
                    }
                }
                for (var i = 0; i < dapanArr.length; i++) {
                    _this.dapanVM.items.push(new Market(closePrice[i], dapanArr[i].market_name, dapanArr[i].property, dapanArr[i].position / 10 + '成仓', openPrice[i]));
                    $("div.imgDiv svg")[i].id = "tendgraph_" + (i + 1);
                }

                var proposalData = proposalResult[0].data;
                _this.dapanVM.proposalPredictionsVM.position(proposalData.main_position + '%');
                _this.dapanVM.proposalPredictionsVM.prediction(proposalData.main_tendency);
                var currentPosition = (asset[0].data.total_value * 100 / 200000).toFixed(0);
                option_3.series[0].data[0].value = currentPosition;
                option_3.series[0].data[1].value = 100 - currentPosition;
                myChart = echarts.init(document.getElementById('main-3'));
                myChart.setOption(option_3);
            }).fail(function () {
                console.log('fail');
            });
    }
    function computeSvgGraph(data, zhishutype, ringttype) {
        var different = [];
        var max = data[0], min = data[0];
        for (var i = 0; i < data.length; i++) {
            max = data[i] > max ? data[i] : max;
            min = data[i] < min ? data[i] : min;
            if (i < data.length - 1) {
                different.push(data[i + 1] - data[i]);
            }
        }
        var ratio = (max - min) / 6;
        var x, y;
        for (var i = 0; i < 17; i++) {
            x = (i * 21).toString();
            y = ((parseInt(((max - data[i]) / ratio)) + 3) * 21).toString();
            var fill = (different[i] > 0 ? "#E74C3C" : (different[i] < 0 ? "#27AE60" : "#cccccc"));
            $("#tendgraph_" + zhishutype + " > rect[x=" + x + "][y=" + y + "]").attr("fill", fill);
        }
        var ylist = [];
        switch (ringttype) {
            case 1: ylist = [0, 1, 2, 1, 0, 1, 2, 3]; break;
            case 2: ylist = [0, 1, 0, -1, 0, 1, 2, 3]; break;
            case 3: ylist = [0, 1, 0, 1, 2, 1, 0, -1]; break;
        }
        for (var i = 0; i < 8; i++) {
            var x2 = (i * 21 + 368).toString();
            var y2 = (parseInt(y) - ylist[i] * 21).toString();
            $("#tendgraph_" + zhishutype + " > rect[x=" + x2 + "][y=" + y2 + "]").attr("fill", "#999999");
        }
    }
}



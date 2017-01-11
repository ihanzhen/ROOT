$(function () {
    var bankuaiDetailManagement = new BankuaiDetailManagement();
    bankuaiDetailManagement.init();
})
var BankuaiDetailManagement = function () {
    var _this = this;
    _this.plateCode = '';
    _this.plateType = '';
    _this.codeList = [];
    _this.stockDetailsArr = [];
    var headerVM = {
        boardName: ko.observable(''),
        boardCode:ko.observable('')
    }
    function News() {
        this.isUp = ko.observable(true);//fake data
        this.newsTitle = ko.observable('三季度十大预增王 预增546倍夺冠');//fake data
    }
    function PlateVM() {
        _vm = this;
        _vm.isShowRecommend = ko.observable(false);
        _vm.stocks = ko.observableArray([]);
        _vm.newsItems = ko.observableArray([]);//fake data
    }
    _this.plateVM = new PlateVM();
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        _this.plateCode = queryString.plateCode;
        _this.plateType = queryString.plateType;
        headerVM.boardCode(_this.plateCode);
        ko.applyBindings(_this.plateVM, $('#bkdetails-container')[0]);
        ko.applyBindings(headerVM, $('#header')[0]);
        _this.getPageData();
        //var int = self.setInterval(_this.updatePlateAsync, 5 * 1000);
    }
    function Stock(stockCode, stockName) {
        this.stockCode = ko.observable(stockCode);
        this.stockName = ko.observable(stockName);
        this.isSelfSelect = ko.observable(false);
        this.isTechnology = ko.observable(false);
        this.isFundamental = ko.observable(false);
        this.isEvent = ko.observable(false);
        this.stars = ko.observable(0);
        this.stockDetailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.stockCode() + "&stockName=" + item.stockName();
        };
        this.selectClick = function (item) {
            addorDeleteSelfSelect(item);
        }
    }
    _this.getPlateData = function (palteType) {
        switch (palteType) {
            case 'recommend': _this.plateVM.isShowRecommend(true); break;
            case 'strong':
                window.stock.loading(true);
                return $.ajax({
                    url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/0',
                    dataType: "jsonp",
                    jsonpCallback: "jsonpcallback",
                    timeout: 5000,
                    type: "GET",
                    success: function (data) { }
                }); break;
            case 'anticipation':
                window.stock.loading(true);
                return $.ajax({
                    url: 'http://119.164.253.142:3307/api/v1.0/stocksboardready/0',
                    dataType: "jsonp",
                    jsonpCallback: "jsonpcallback",
                    timeout: 5000,
                    type: "GET",
                    success: function (data) { }
                }); break;
        }

    }
    function getIndexAjax(windcode) {
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksindex/?num=17&type&windcode='+windcode,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) { }
        });
    }
    _this.getChartData=function(){
        $.when(getIndexAjax('000001.SH'), getIndexAjax(_this.plateCode)).done(function (dapan, board) {
            if (dapan[0].data) {
                option.series[0].data = dapan[0].data.data;
            }
            if (board[0].data) {
                option.series[1].data = board[0].data.data;
            }
            option.xAxis[0].data = ["12/24", "12/25", "12/26", "12/27", "12/28", "12/29", "12/30", "12/31", "1/01", "1/02", "1/03",
            "1/04", "1/05", "1/06", "1/07", "1/08", "1/09"];
            option.grid.left = "0";
            option.series[1].name = headerVM.boardName();
            myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(option);
        });
    }
    _this.getPageData = function () {
        window.stock.loading(true);
        $.when(_this.getPlateData(_this.plateType), getIndexAjax('000001.SH'), getIndexAjax(_this.plateCode))
            .done(function (result, dapan, board) {
                window.stock.loading(false);//以后删掉
                if (result[0] && result[0].data && result[0].data.length > 0) {
                    var data = result[0].data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].windcode == _this.plateCode) {
                            headerVM.boardName(data[i].name);
                            if (data[i].stockslist && data[i].stockslist.length > 0) {
                                var stocks = data[i].stockslist;
                                for (var j = 0; j < stocks.length; j++) {
                                    _this.plateVM.stocks.push(new Stock(stocks[j].windcode, stocks[j].name));
                                    _this.codeList.push(stocks[j].windcode);
                                }
                            }
                            break;
                        }
                    }
                    if (_this.codeList.length > 0) {
                        getSelftSelectEvent(_this.codeList);
                        for (var i = 0; i < _this.codeList.length ; i++) {
                            getStockDetailAjax(_this.codeList[i]);
                        }
                    } else {
                        window.stock.loading(false);
                    }
                }
                if (dapan[0].data) {
                    option.series[0].data = dapan[0].data.data;
                }
                if (board[0].data) {
                    option.series[1].data = board[0].data.data;
                }
                option.xAxis[0].data = ["12/24", "12/25", "12/26", "12/27", "12/28", "12/29", "12/30", "12/31", "1/01", "1/02", "1/03",
                "1/04", "1/05", "1/06", "1/07", "1/08", "1/09"];
                option.grid.left = "0";
                option.legend.data[1] = headerVM.boardName();
                option.series[1].name = headerVM.boardName();
                myChart = echarts.init(document.getElementById('main'));
                myChart.setOption(option);
            }).fail(function () {
                window.stock.loading(false);
                console.log('fail');
            });
    };
    function array2urlstr(arr, codenameStr) {
        var tempArr = [];
        for (var i = 0; i < arr.length; i++) {
            var str = codenameStr + "=" + arr[i];
            tempArr.push(str);
        }
        return tempArr.join("&");
    }
    //查询 是否自选 事件
    function getSelftSelectEvent(arr) {
        var url = '/ihanzhendata/logicstocks/selfstocks/' + localStorage.uid;
        var sendData = array2urlstr(arr, "stock_code");
        window.stock.loading(true);
        $.get(url, sendData, function (data) {
            //window.stock.loading(false);
            if (data && data.data) {
                var stockList = data.data;
                for (var i = 0; i < _this.plateVM.stocks().length; i++) {
                    for (var j = 0; j < stockList.length; j++) {
                        if (_this.plateVM.stocks()[i].stockCode() == stockList[j].stock_code) {
                            _this.plateVM.stocks()[i].isSelfSelect(Boolean(parseInt(stockList[j].is_zxg)));
                            _this.plateVM.stocks()[i].isEvent(Boolean(parseInt(stockList[j].is_logic)));
                            break;
                        }
                    }
                }
            }
        }).error(function () {
            window.stock.loading(false);
        });
    }
    function getStockDetailAjax(stockCode) {
        window.stock.loading(true);
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksbasic/' + stockCode,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                if (data && data.data) {
                    var stock = data.data;
                    var temp = {
                        stockCode: stockCode,
                        stars: stock.stars
                    }
                    _this.stockDetailsArr.push(temp);
                    if (_this.stockDetailsArr.length == _this.codeList.length) {
                        var arr = _this.stockDetailsArr;
                        for (var i = 0; i < _this.plateVM.stocks().length; i++) {
                            for (var j = 0; j < arr.length; j++) {
                                if (_this.plateVM.stocks()[i].stockCode() == arr[j].stockCode) {
                                    _this.plateVM.stocks()[i].stars(arr[j].stars);
                                    break;
                                }
                            }
                        }
                        window.stock.loading(false);
                    }
                }

            }
        });
    }
}



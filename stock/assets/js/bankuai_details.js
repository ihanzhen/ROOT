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
            window.stock.loading(true);
            $.post('/ihanzhendata/selfStock/saveSelfStock', {
                uid: localStorage.uid,
                stock_code: _this.confirmVM.stockCode,
                stock_name: _this.confirmVM.stockName,
                b_zx: _this.confirmVM.select()
            }, function (data) {
                window.stock.loading(false);
                if (data.status == 1) {
                    _this.noticeVM.notice('添加自选成功！');
                    $('#notice-alert').modal('open');
                    _this.plateVM.stocks([]);
                    _this.getPageData();
                } else if (data.status == 12008) {
                    _this.noticeVM.notice('自选已存在，不用重复添加！');
                    $('#notice-alert').modal('open');
                } else {
                    _this.noticeVM.notice('添加自选失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                window.stock.loading(false);
                _this.noticeVM.notice('添加自选失败！');
                $('#notice-alert').modal('open');
            });
        }
    };
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
        ko.applyBindings(_this.plateVM, $('#bkdetails-container')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
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
            if (item.isSelfSelect()) {
                window.stock.loading(true);
                $.ajax({
                    url: '/ihanzhendata/selfStock/deleteSelfStock',
                    method: 'POST',
                    data: {
                        uid: localStorage.uid,
                        stock_code: item.stockCode()
                    },
                    success: function (result) {
                        window.stock.loading(false);
                        if (result && result.status == 1) {
                            _this.noticeVM.notice('自选股删除成功！');
                            $('#notice-alert').modal('open');
                            _this.plateVM.stocks([]);
                            _this.getPageData();
                        } else {
                            _this.noticeVM.notice('自选股删除失败！');
                            $('#notice-alert').modal('open');
                        }
                    },
                    error: function () {
                        window.stock.loading(false);
                        _this.noticeVM.notice('自选股删除失败！');
                        $('#notice-alert').modal('open');
                    }
                });
            } else {
                _this.confirmVM.stockCode = item.stockCode();
                _this.confirmVM.stockName = item.stockName();
                if (localStorage.s_zx1 != undefined && localStorage.s_zx2 != undefined && localStorage.s_zx3 != undefined) {
                    _this.confirmVM.firstMark(localStorage.s_zx1);
                    _this.confirmVM.secondMark(localStorage.s_zx2);
                    _this.confirmVM.thirdMark(localStorage.s_zx3);
                    $('#confirm-alert').modal();
                }
                else {
                    window.stock.loading(true);
                    $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) {
                        window.stock.loading(false);
                        if (data && data.data) {
                            var bzdata = data.data;
                            _this.confirmVM.firstMark(bzdata.s_zx1);
                            _this.confirmVM.secondMark(bzdata.s_zx2);
                            _this.confirmVM.thirdMark(bzdata.s_zx3);
                        }
                        $('#confirm-alert').modal();
                    }).error(function () {
                        window.stock.loading(false);
                    });
                }
            }
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
    _this.getPageData = function () {
        window.stock.loading(true);
        $.when(_this.getPlateData(_this.plateType))
            .done(function (result) {
                window.stock.loading(false);//以后删掉
                if (result && result.data && result.data.length > 0) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].windcode == _this.plateCode) {
                            $("#boardName").text(data[i].name);
                            $("#boardCode").text(data[i].windcode);
                            if (data[i].stockslist && data[i].stockslist.length > 0) {
                                var stocks = data[i].stockslist;
                                for (var j = 0; j < stocks.length; j++) {
                                    _this.plateVM.stocks.push(new Stock(stocks[j].windcode, stocks[j].name));
                                    _this.codeList.push(stocks[j].windcode);
                                }
                            }
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



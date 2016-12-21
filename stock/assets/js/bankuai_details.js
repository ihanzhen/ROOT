$(function () {
    var bankuaiDetailManagement = new BankuaiDetailManagement();
    bankuaiDetailManagement.init();
})
var BankuaiDetailManagement = function () {
    var _this = this;
    _this.plateCode = '';
    _this.plateType = '';
    _this.stockList = [];
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
                $('#my-modal-loading').modal('close');
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
        this.isRecommend = ko.observable(false);
        this.isValueble = ko.observable(false);
        this.stars = ko.observable(0);
        this.isSelfSelect = ko.observable(false);
        this.stockDetailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.stockCode() + "&stockName=" + item.stockName();
        };
        this.selectClick = function (item) {
            if (item.isSelfSelect()) {
                $('#my-modal-loading').modal('open');
                $.ajax({
                    url: '/ihanzhendata/selfStock/deleteSelfStock',
                    method: 'POST',
                    data: {
                        uid: localStorage.uid,
                        stock_code: item.stockCode()
                    },
                    success: function (result) {
                        $('#my-modal-loading').modal('close');
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
                        $('#my-modal-loading').modal('close');
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
    }
    _this.getWordIconData = function () {
        $('#my-modal-loading').modal('open');
        $.when(getStockPropertyAjax(_this.codeList)).done(function (result) {
            $('#my-modal-loading').modal('close');
            _this.stockList = result;
            for (var i = 0; i < _this.plateVM.stocks().length; i++) {
                for (var j = 0; j < _this.stockList.length; j++) {
                    if (_this.plateVM.stocks()[i].stockCode == _this.stockList[j].headstock_code) {
                        _this.plateVM.stocks()[i].isSelfSelect(_this.stockList[j].is_zxg);
                        _this.plateVM.stocks()[i].isValueble(_this.stockList[j].is_jzg);
                        _this.plateVM.stocks()[i].guzhi(_this.stockList[j].value);
                    }
                }
            }
        }).fail(function () {
            $('#my-modal-loading').modal('close');
            console.log('fail');
        })
    }
    _this.getPlateData = function (palteType) {
        switch (palteType) {
            case 'recommend': _this.plateVM.isShowRecommend(true); break;
            case 'strong':
                $('#my-modal-loading').modal('open');
                return $.ajax({
                    url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/',
                    dataType: "jsonp",
                    jsonpCallback: "jsonpcallback",
                    timeout: 5000,
                    type: "GET",
                    success: function (data) { }
                }); break;
            case 'anticipation':
                $('#my-modal-loading').modal('open');
                return $.ajax({
                    url: 'http://119.164.253.142:3307/api/v1.0/stocksboardready/',
                    dataType: "jsonp",
                    jsonpCallback: "jsonpcallback",
                    timeout: 5000,
                    type: "GET",
                    success: function (data) { }
                }); break;
        }

    }
    _this.getPageData = function () {
        $('#my-modal-loading').modal('open');
        $.when(_this.getPlateData(_this.plateType))
            .done(function (result) {
                if (result && result.data) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].windcode == _this.plateCode) {
                            $("#boardName").text(data[i].name);
                            var stocks = data[i].stockslist;
                            for (var j = 0; j < stocks.length; j++) {
                                _this.plateVM.stocks.push(new Stock(stocks[j].windcode, stocks[j].name));
                                _this.plateVM.stocks()[j].isRecommend(true);
                                var temp = {
                                    uid: localStorage.uid,
                                    stock_code: stocks[j].windcode
                                };
                                _this.codeList.push(temp);
                            }
                        }
                    }
                    //_this.getWordIconData();
                    for (var i = 0; i < _this.codeList.length ; i++) {
                        getStockDetailAjax(_this.codeList[i].stock_code);
                    }
                }
            }).fail(function () {
                $('#my-modal-loading').modal('close');
                console.log('fail');
            });
    };
    function getStockPropertyAjax(arr) {
        $('#my-modal-loading').modal('open');
        return $.post('/', JSON.stringify(arr));
    }
    function getStockDetailAjax(stockCode) {
        $('#my-modal-loading').modal('open');
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
                    if (_this.stockDetailsArr.length==_this.codeList.length) {
                        var arr=_this.stockDetailsArr;
                        for (var i = 0; i < arr.length; i++) {
                            for (var j = 0; j < arr.length; j++) {
                                if (_this.plateVM.stocks()[i].stockCode() == arr[j].stockCode) {
                                    _this.plateVM.stocks()[i].stars(arr[j].stars);
                                }
                            }
                        }
                        $('#my-modal-loading').modal('close');
                    }
                }
                
            }
        });
    }
}



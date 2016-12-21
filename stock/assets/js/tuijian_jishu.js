$(function () {
    var jishuManagement = new JishuManagement();
    jishuManagement.init();
})
var JishuManagement = function () {
    var _this = this;
    _this.stockList = [];
    _this.codeList = [];
    _this.stockDetailsArr = [];
    var jishuVM = {
        tabVM: {
            strongClick: function () {
                //jishuVM.strongVM.items([]);
                //_this.codeList = [];
                //_this.stockDetailsArr = [];
                //getStrongData();
            },
            readyClick: function () {
                jishuVM.readyVM.items([]);
                _this.codeList = [];
                _this.stockDetailsArr = [];
                getReadyData();
            },
            volClick: function () {

            },
            centerClick: function () {

            }
        },
        strongVM: {
            items: ko.observableArray([])
        },
        readyVM: {
            items: ko.observableArray([])
        },
        volVM: {
            items: ko.observableArray([])
        },
        centerVM: {
            items: ko.observableArray([])
        },
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
                    var tab = $('div.am-in.am-active')[0].id;
                    switch (tab) {
                        case 'tab1': jishuVM.strongVM.items([]); getStrongData(); break;
                        case 'tab2':; jishuVM.readyVM.items([]); getReadyData(); break;
                        case 'tab3':; jishuVM.volVM.items([]); break;
                        case 'tab4':; jishuVM.centerVM.items([]); break;
                    }
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
    function Stock(sname, scode, change, value) {
        this.sname = ko.observable(sname);
        this.scode = ko.observable(scode);
        this.isSelfSelect = ko.observable(false);
        this.change = ko.observable(change);
        this.value = ko.observable(value);
        this.stars = ko.observable(0);
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
                            var tab = $('div.am-in.am-active')[0].id;
                            switch (tab) {
                                case 'tab1': jishuVM.strongVM.items([]); getStrongData(); break;
                                case 'tab2':; jishuVM.readyVM.items([]); getReadyData(); break;
                                case 'tab3':; jishuVM.volVM.items([]); break;
                                case 'tab4':; jishuVM.centerVM.items([]); break;
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
    }
    var getStrongAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksstrong/',
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) { }
        });
    };
    var getReadyAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksready/',
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) { }
        });
    };
    var getStrongData = function () {
        $('#my-modal-loading').modal('open');
        $.when(getStrongAjax()).done(function (strong) {
            //$('#my-modal-loading').modal('close');
            if (strong && strong.data) {
                var arr = strong.data;
                for (var i = 0; i < arr.length; i++) {
                    var stock = new Stock(arr[i].name, arr[i].windcode, (arr[i].pct).toFixed(2), (arr[i].cap / 100000000).toFixed(2) + '亿');
                    jishuVM.strongVM.items.push(stock);
                    var temp = {
                        uid: localStorage.uid,
                        stock_code: arr[i].windcode
                    };
                    _this.codeList.push(temp);
                }
                _this.getWordIconData();
                for (var i = 0; i < _this.codeList.length ; i++) {
                    getStockDetailAjax(_this.codeList[i].stock_code);
                }
            }
        }).fail(function () {
            $('#my-modal-loading').modal('close');
        });
    };
    var getReadyData = function () {
        $('#my-modal-loading').modal('open');
        $.when(getReadyAjax()).done(function (ready) {
            //$('#my-modal-loading').modal('close');
            if (ready && ready.data) {
                var arr = ready.data;
                for (var i = 0; i < arr.length; i++) {
                    var stock = new Stock(arr[i].name, arr[i].windcode, (arr[i].pct).toFixed(2), (arr[i].cap / 100000000).toFixed(2) + '亿');
                    jishuVM.readyVM.items.push(stock);
                    var temp = {
                        uid: localStorage.uid,
                        stock_code: arr[i].windcode
                    };
                    _this.codeList.push(temp);
                }
                //setTimeout(function () {
                    // _this.getWordIconData();
                    for (var i = 0; i < _this.codeList.length ; i++) {
                        getStockDetailAjax(_this.codeList[i].stock_code);
                    }
                //}, 500);
            }
        }).fail(function () {
            $('#my-modal-loading').modal('close');
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
                    if (_this.stockDetailsArr.length == _this.codeList.length) {
                        $('#my-modal-loading').modal('close');
                        var arr = _this.stockDetailsArr;
                        var tab = $('div.am-in.am-active')[0].id;
                        var vm = null;
                        switch (tab) {
                            case 'tab1': vm = jishuVM.strongVM; break;
                            case 'tab2': vm = jishuVM.readyVM; break;
                            case 'tab3': vm = jishuVM.volVM; break;
                            case 'tab4': vm = jishuVM.centerVM; break;
                        }
                        for (var i = 0; i < vm.items().length; i++) {
                            for (var j = 0; j < arr.length; j++) {
                                if (vm.items()[i].scode() == arr[j].stockCode) {
                                    vm.items()[i].stars(arr[j].stars);
                                    break;
                                }
                            }
                        }
                    }
                }

            }
        }).error(function () {
            console.log('error');
            $('#my-modal-loading').modal('close');
        });
    };
    _this.getWordIconData = function () {
        $.when(getStockPropertyAjax(_this.codeList)).done(function (result) {
            $('#my-modal-loading').modal('close');
            _this.stockList = result;
            //for (var i = 0; i < _this.plateVM.stocks().length; i++) {
            //    for (var j = 0; j < _this.stockList.length; j++) {
            //        if (_this.plateVM.stocks()[i].stockCode == _this.stockList[j].headstock_code) {
            //            _this.plateVM.stocks()[i].isSelfSelect(_this.stockList[j].is_zxg);
            //            _this.plateVM.stocks()[i].isValueble(_this.stockList[j].is_jzg);
            //            _this.plateVM.stocks()[i].guzhi(_this.stockList[j].value);
            //        }
            //    }
            //}
        }).fail(function () {
            $('#my-modal-loading').modal('close');
            console.log('fail');
        })
    }
    _this.init = function () {
        ko.applyBindings(jishuVM, $('#jishu-container')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        //getStrongData();
    }
}
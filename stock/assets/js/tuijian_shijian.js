$(function () {
    var shijianManagement = new ShijianManagement();
    shijianManagement.init();
})
var ShijianManagement = function () {
    var _this = this;
    _this.pageNumber = 1; //设置当前页数，全局变量  
    var shijianVM = {
        items: ko.observableArray([])
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
        selectFirstClick: function () {
            _this.confirmVM.select('1');
        },
        selectSecondClick: function () {
            _this.confirmVM.select('2');
        },
        selectThirdClick: function () {
            _this.confirmVM.select('3');
        },
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
                    _this.pageNumber = 1; //设置当前页数，全局变量  
                    shijianVM.items([]);
                    getStocksData();
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
    }
    function Stock(sname, scode, logicName) {
        this.sname = ko.observable(sname);
        this.scode = ko.observable(scode);
        this.logicName = ko.observable(logicName);
        this.isSelfSelect = ko.observable(false);
        this.isTechnology = ko.observable(false);
        this.isFundamental = ko.observable(false);
        this.isEvent = ko.observable(false);
        this.isMain = ko.observable(false);
        this.stars = ko.observable(0);
        this.redirectClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
        this.selectClick = function (item) {
            if (item.isSelfSelect()) {
                window.stock.loading(true);
                $.ajax({
                    url: '/ihanzhendata/selfStock/deleteSelfStock',
                    method: 'POST',
                    data: {
                        uid: localStorage.uid,
                        stock_code: item.scode()
                    },
                    success: function (result) {
                        window.stock.loading(false);
                        if (result && result.status == 1) {
                            _this.noticeVM.notice('自选股删除成功！');
                            $('#notice-alert').modal('open');
                            _this.pageNumber = 1; //设置当前页数，全局变量  
                            shijianVM.items([]);
                            getStocksData();
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
                _this.confirmVM.stockCode = item.scode();
                _this.confirmVM.stockName = item.sname();
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
    function getStocksData() {
        $('.loadspan').show();
        $.get('/ihanzhendata/logicstocks/' + localStorage.uid + '/' + _this.pageNumber++, function (data) {
            $('.loadspan').hide();
            if (data && data.status == 1) {
                var stocks = data.data;
                var tempStocks = [];
                if (stocks.length > 0) {
                    for (var i = 0; i < stocks.length; i++) {
                        shijianVM.items.push(new Stock(stocks[i].stock_name, stocks[i].stock_code, stocks[i].logic_name));
                        tempStocks.push(stocks[i].stock_code);
                    }
                    getSelftSelectEvent(tempStocks);
                    getLabelStars(tempStocks);
                } else if (stocks.length == 0) {
                    $(window).unbind('scroll');
                    $('.nomore').show();
                }
            }
            if (_this.pageNumber == 2) {
                getStocksData();
            }
        }).error(function () {
            $('.loadspan').hide();
        });
    }
    function array2urlstr(arr, codenameStr) {
        var tempArr = [];
        for (var i = 0; i < arr.length; i++) {
            var str = codenameStr + "=" + arr[i];
            tempArr.push(str);
        }
        return tempArr.join("&");
    }
    //查询是否是技术面股池和星级和是否是基本面股池
    function getLabelStars(arr) {
        $('.loadspan').show();
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stockslabel/?' + array2urlstr(arr, 'windcode'),
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                $('.loadspan').hide();
                if (data && data.data) {
                    var resultArr = data.data;
                    for (var i = 0; i < shijianVM.items().length; i++) {
                        for (var j = 0; j < resultArr.length; j++) {
                            if (shijianVM.items()[i].scode() == resultArr[j].windcode) {
                                shijianVM.items()[i].stars(resultArr[j].stars);
                                shijianVM.items()[i].isTechnology(Boolean(resultArr[j].is_jishu));
                                shijianVM.items()[i].isFundamental(Boolean(resultArr[j].is_jiben));
                                shijianVM.items()[i].isMain(Boolean(resultArr[j].is_mf));
                                break;
                            }
                        }
                    }
                }

            }
        }).error(function () {
            console.log('error');
            $('.loadspan').hide();
        });
    }
    //查询 是否自选 事件
    function getSelftSelectEvent(arr) {
        var url = '/ihanzhendata/logicstocks/selfstocks/' + localStorage.uid;
        var sendData = array2urlstr(arr, "stock_code");
        $('.loadspan').show();
        $.get(url, sendData, function (data) {
            $('.loadspan').hide();
            if (data && data.data) {
                var stockList = data.data;
                for (var i = 0; i < shijianVM.items().length; i++) {
                    for (var j = 0; j < stockList.length; j++) {
                        if (shijianVM.items()[i].scode() == stockList[j].stock_code) {
                            shijianVM.items()[i].isSelfSelect(Boolean(parseInt(stockList[j].is_zxg)));
                            shijianVM.items()[i].isEvent(Boolean(parseInt(stockList[j].is_logic)));
                            break;
                        }
                    }
                }
            }
        }).error(function () {
            $('.loadspan').hide();
        });
    }
    _this.init = function () {
        $("#KEY_FRESH").click(function () {
            window.location.reload();//刷新当前页面.
        });
        $(window).scroll(scrollHandler);
        ko.applyBindings(shijianVM, $('#shijian-container')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        getStocksData();
    }
    //==============上拉加载核心代码=============  
    var winH = $(window).height(); //页面可视区域高度   
    var scrollHandler = function () {
        var pageH = $(document.body).height();
        var scrollT = $(window).scrollTop(); //滚动条top   
        var aa = (pageH - winH - scrollT) / winH;
        if (aa < 0.02) {//0.02是个参数  
            getStocksData();
        }
    }
    //==============上拉加载核心代码============= 
}

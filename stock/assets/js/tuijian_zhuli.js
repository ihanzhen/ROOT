$(function () {
    var shijianManagement = new ShijianManagement();
    shijianManagement.init();
})
var ShijianManagement = function () {
    var _this = this;
    _this.pageNumber = 1; //设置当前页数，全局变量  
    _this.codeList = [];
    var zhuliVM = {
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
                    _this.codeList = [];
                    zhuliVM.items([]);
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
    function Buyer(buyer, ratio, cost, target) {
        this.buyer = ko.observable(buyer);
        this.ratio = ko.observable(ratio);
        this.cost = ko.observable(cost);
        this.target = ko.observable(target);
    }
    function Stock(sname, scode, type) {
        this.sname = ko.observable(sname);
        this.scode = ko.observable(scode);
        this.type = ko.observable(type);
        this.isSelfSelect = ko.observable(false);
        this.isTechnology = ko.observable(false);
        this.isFundamental = ko.observable(false);
        this.isEvent = ko.observable(false);
        this.isMain = ko.observable(false);
        this.stars = ko.observable(0);
        this.price = ko.observable(0);
        this.change = ko.observable(0);
        this.buyerItems = ko.observableArray([]);
        this.redirectClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
        this.selectClick = function (item, event) {
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
                            _this.codeList = [];
                            zhuliVM.items([]);
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
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksmainforce/' + _this.pageNumber++,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                $('.loadspan').hide();
                if (data && data.data && data.data.length > 0) {
                    var stockArr = data.data;
                    var tempStocks = [];
                    for (var i = 0; i < stockArr.length; i++) {
                        var type = "";
                        switch (stockArr[i].type) {
                            case "new": type = "新进"; break;
                            case "inc": type = "增持"; break;
                            case "equal": type = "持平"; break;
                        }
                        zhuliVM.items.push(new Stock(stockArr[i].name, stockArr[i].windcode, type));
                        _this.codeList.push(stockArr[i].windcode);
                        tempStocks.push(stockArr[i].windcode);
                        zhuliVM.items()[(_this.codeList.length - 1)].buyerItems.push(new Buyer("800001.JG", stockArr[i].ratio.toFixed(2) + "%", stockArr[i].cost, stockArr[i].target));
                        $($("li.am-panel >a")[(_this.codeList.length - 1)]).attr("data-am-collapse", "{parent: '#collapase-nav-1', target: '#li-" + (_this.codeList.length - 1) + "'}");
                        $("li.am-panel >ul")[(_this.codeList.length - 1)].id = "li-" + (_this.codeList.length - 1);
                    }
                    getSelftSelectEvent(tempStocks);
                    getLabelStars(tempStocks);
                    getStockPrice(tempStocks);
                } else if (data && data.data && data.data.length == 0) {
                    $(window).unbind('scroll');
                    $('.loadspan').hide();
                    $('.nomore').show();
                }
                if (_this.pageNumber == 2) {
                    getStocksData();
                }
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
                    for (var i = 0; i < zhuliVM.items().length; i++) {
                        for (var j = 0; j < resultArr.length; j++) {
                            if (zhuliVM.items()[i].scode() == resultArr[j].windcode) {
                                zhuliVM.items()[i].stars(resultArr[j].stars);
                                zhuliVM.items()[i].isTechnology(Boolean(resultArr[j].is_jishu));
                                zhuliVM.items()[i].isFundamental(Boolean(resultArr[j].is_jiben));
                                zhuliVM.items()[i].isMain(Boolean(resultArr[j].is_mf));
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
                for (var i = 0; i < zhuliVM.items().length; i++) {
                    for (var j = 0; j < stockList.length; j++) {
                        if (zhuliVM.items()[i].scode() == stockList[j].stock_code) {
                            zhuliVM.items()[i].isSelfSelect(Boolean(parseInt(stockList[j].is_zxg)));
                            zhuliVM.items()[i].isEvent(Boolean(parseInt(stockList[j].is_logic)));
                            break;
                        }
                    }
                }
            }
        }).error(function () {
            $('.loadspan').hide();
        });
    }
    function getStockPrice(arr) {
        $('.loadspan').show();
        if (arr && arr.length > 0) {
            var parameterArr = [];
            for (var i = 0; i < arr.length; i++) {
                parameterArr.push('s_' + arr[i].substring(7, 9).toLowerCase() + arr[i].substring(0, 6));
            }
            //获取实时数据,与后台获取数据组合,拼成买入、卖出和持仓Tab页下面的列表
            var parameterStr = parameterArr.join(',');
            var url = 'http://hq.sinajs.cn/list=' + parameterStr;
            $.ajax({
                cache: true,
                url: url,
                type: 'GET',
                dataType: 'script',
                timeout: 2000,
                success: function (data, textStatus, jqXHR) {
                    $('.loadspan').hide();
                    var resultArr = [];//二维数组
                    for (var i = 0; i < parameterArr.length; i++) {
                        var code = parameterArr[i].substr(4) + "." + parameterArr[i].substring(2, 4).toUpperCase();
                        resultArr[i] = [];
                        resultArr[i].push(code);
                        resultArr[i].push(eval('hq_str_' + parameterArr[i]).split(','));
                    }
                    for (var i = 0; i < zhuliVM.items().length; i++) {
                        for (var j = 0; j < resultArr.length; j++) {
                            if (zhuliVM.items()[i].scode() == resultArr[j][0]) {
                                zhuliVM.items()[i].price(Number(resultArr[j][1][1]).toFixed(2));
                                zhuliVM.items()[i].change(Number(resultArr[j][1][2]));
                                break;
                            }
                        }
                    }
                }
            }).error(function () {
                $('.loadspan').hide();
            });
        }
    }
    _this.init = function () {
        $("#KEY_FRESH").click(function () {
            window.location.reload();//刷新当前页面.
        });
        $(window).scroll(scrollHandler);
        ko.applyBindings(zhuliVM, $('#zhuli-container')[0]);
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

$(function () {
    var shijianManagement = new ShijianManagement();
    shijianManagement.init();
})
var ShijianManagement = function () {
    var _this = this;
    var pageNumber = 1; //设置当前页数，全局变量 
    var haslock = false;//是否锁上上拉加载
    _this.init = function () {
        $("#KEY_FRESH").click(function () {
            window.location.reload();//刷新当前页面.
        });
        $(window).scroll(scrollHandler);
        ko.applyBindings(shijianVM, $('#shijian-container')[0]);
        getStocksData();
    }
    var shijianVM = {
        items: ko.observableArray([])
    }
    function getStocksData() {
        $('.loadspan').show();
        haslock = true;
        $.get('/ihanzhendata/logicstocks/' + localStorage.uid + '/' + pageNumber++, function (data) {
            $('.loadspan').hide();
            haslock = false;
            if (data && data.status == 1) {
                var stocks = data.data;
                var tempStocks = [];
                if (stocks.length > 0) {
                    for (var i = 0; i < stocks.length; i++) {
                        shijianVM.items.push(new Stock(stocks[i].stock_name, stocks[i].stock_code, stocks[i].logic_name));
                        tempStocks.push(stocks[i].stock_code);
                    }
                    getSelftSelectEvent(tempStocks, shijianVM);
                    getLabelStars(tempStocks);
                } else if (stocks.length == 0) {
                    $(window).unbind('scroll');
                    $('.nomore').show();
                }
            }
            if (pageNumber == 2) {
                getStocksData();
            }
        }).error(function () {
            $('.loadspan').hide();
            haslock = false;
        });
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
            addorDeleteSelfSelect(item);
        }
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
    //==============上拉加载核心代码=============  
    var winH = $(window).height(); //页面可视区域高度   
    var scrollHandler = function () {
        var pageH = $(document.body).height();
        var scrollT = $(window).scrollTop(); //滚动条top   
        var aa = (pageH - winH - scrollT) / winH;
        if (aa < 0.02) {//0.02是个参数  
            if (!haslock) {
                getStocksData();
            }
        }
    }
    //==============上拉加载核心代码============= 
}

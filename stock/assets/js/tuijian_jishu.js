$(function () {
    var jishuManagement = new JishuManagement();
    jishuManagement.init();
})
var JishuManagement = function () {
    var _this = this;
    var pageNumber = 1; //设置当前页数，全局变量  
    var haslock = false;//是否锁上上拉加载
    _this.init = function () {
        $("#KEY_FRESH").click(function () {
            window.location.reload();//刷新当前页面.
        });
        ko.applyBindings(jishuVM, $('#jishu-container')[0]);
        jishuVM.tabVM.strongClick();
    }
    var jishuVM = {
        tabVM: {
            strongClick: function () {
                $('.nomore').hide();
                pageNumber = 1; //设置当前页数，全局变量  
                haslock = false;//是否锁上上拉加载
                $(window).scroll(scrollHandler);
                jishuVM.strongVM.items([]);
                getStrongList();
            },
            readyClick: function () {
                $('.nomore').hide();
                pageNumber = 1; //设置当前页数，全局变量  
                haslock = false;//是否锁上上拉加载
                $(window).scroll(scrollHandler);
                jishuVM.readyVM.items([]);
                getReadyList();
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

    function Stock(sname, scode) {
        this.sname = ko.observable(sname);
        this.scode = ko.observable(scode);
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
    function getStrongList() {
        $('.loadspan').show();
        haslock = true;
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksstrong/' + pageNumber++,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                haslock = false;
                if (data && data.data && data.data.length > 0) {
                    var arr = data.data;
                    var tempStocks = [];
                    for (var i = 0; i < arr.length; i++) {
                        var stock = new Stock(arr[i].name, arr[i].windcode);
                        jishuVM.strongVM.items.push(stock);
                        tempStocks.push(arr[i].windcode);
                    }
                    getSelftSelectEvent(tempStocks, jishuVM.strongVM);
                    getLabelStars(tempStocks);
                } else if (data && data.data && data.data.length == 0) {
                    $('.loadspan').hide();
                    $(window).unbind('scroll');
                    $('.nomore').show();
                }
                if (pageNumber == 2) {
                    getStrongList();
                }
            }
        }).error(function () {
            haslock = false;
            $('.loadspan').hide();
        });
    };
    function getReadyList() {
        $('.loadspan').show();
        haslock = true;
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksready/' + pageNumber++,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                haslock = false;
                if (data && data.data && data.data.length > 0) {
                    var arr = data.data;
                    var tempStocks = [];
                    for (var i = 0; i < arr.length; i++) {
                        var stock = new Stock(arr[i].name, arr[i].windcode);
                        jishuVM.readyVM.items.push(stock);
                        tempStocks.push(arr[i].windcode);
                    }
                    getSelftSelectEvent(tempStocks, jishuVM.readyVM);
                    getLabelStars(tempStocks);
                } else if (data && data.data && data.data.length == 0) {
                    $('.loadspan').hide();
                    $(window).unbind('scroll');
                    $('.nomore').show();
                }
                if (pageNumber == 2) {
                    getReadyList();
                }
            }
        }).error(function () {
            haslock = false;
            $('.loadspan').hide();
        });
    };
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
                    var tab = $('div.am-in.am-active')[0].id;
                    var vm = null;
                    switch (tab) {
                        case 'tab1': vm = jishuVM.strongVM; break;
                        case 'tab2': vm = jishuVM.readyVM; break;
                        case 'tab3': vm = jishuVM.volVM; break;
                        case 'tab4': vm = jishuVM.centerVM; break;
                    }
                    for (var i = 0; i < vm.items().length; i++) {
                        for (var j = 0; j < resultArr.length; j++) {
                            if (vm.items()[i].scode() == resultArr[j].windcode) {
                                vm.items()[i].stars(resultArr[j].stars);
                                vm.items()[i].isTechnology(Boolean(resultArr[j].is_jishu));
                                vm.items()[i].isFundamental(Boolean(resultArr[j].is_jiben));
                                vm.items()[i].isMain(Boolean(resultArr[j].is_mf));
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
                var tab = $('div.am-in.am-active')[0].id;
                if (tab == 'tab1') {
                    getStrongList();
                } else if (tab == 'tab2') {
                    getReadyList();
                }
            }
        }
    }
    //==============上拉加载核心代码=============  
}

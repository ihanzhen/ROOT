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
        ko.applyBindings(zhuliVM, $('#zhuli-container')[0]);
        getStocksData();
    }
    var codeList = [];
    var zhuliVM = {
        items: ko.observableArray([])
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
        this.recommondReason= ko.observable('');
        this.redirectClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
        this.selectClick = function (item, event) {
            addorDeleteSelfSelect(item);
        }
        this.dropdownClick = function (item) {
            if(1){//to do...折上的时候不获取数据，展开才获取
                $('.loadreason').show();
            $.when(_this.getProposal(item.scode())).done(function (proposal) {
                $('.loadreason').hide();
                if (proposal && proposal.data) {
                    item.recommondReason(proposal.data.descript);
                }
            }).fail(function () {
                $('.loadreason').hide();
            });
            }
        }
    }
    _this.getProposal = function (code) {
        return $.get('/ihanzhendata/logicstocks/' + code + '/details', function (data) {
        });
    }
    function getStocksData() {
        $('.loadspan').show();
        haslock = true;
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksmainforce/' + pageNumber++,
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                $('.loadspan').hide();
                haslock = false;
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
                        codeList.push(stockArr[i].windcode);
                        tempStocks.push(stockArr[i].windcode);
                        zhuliVM.items()[(codeList.length - 1)].buyerItems.push(new Buyer("800001.JG", stockArr[i].ratio.toFixed(2) + "%", stockArr[i].cost, stockArr[i].target));
                        $($("li.am-panel >a")[(codeList.length - 1)]).attr("data-am-collapse", "{parent: '#collapase-nav-1', target: '#li-" + (codeList.length - 1) + "'}");
                        $("li.am-panel >ul")[(codeList.length - 1)].id = "li-" + (codeList.length - 1);
                    }
                    getSelftSelectEvent(tempStocks, zhuliVM);
                    getLabelStars(tempStocks);
                    getStockPrice(tempStocks);
                } else if (data && data.data && data.data.length == 0) {
                    $(window).unbind('scroll');
                    $('.loadspan').hide();
                    $('.nomore').show();
                }
                if (pageNumber == 2) {
                    getStocksData();
                }
            }
        }).error(function () {
            haslock = false;
            $('.loadspan').hide();
        });
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


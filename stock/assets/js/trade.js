$(function () {
    var tradeManagement = new TradeManagement();
    tradeManagement.init();
    var websocket = new WebSocket("ws://123.57.150.251/ihanzhendata/webchat");
    websocket.onmessage = function (evt) {
        var data = evt.data;
        console.log(data);
    }
})
function TradeManagement() {
    var _this = this;
    var pageNumber = 1; //设置当前页数，全局变量  
    var haslock = false;//是否锁上上拉加载
    var moreModalVM = {
        stockObj: {
            scode: ko.observable(''),
            sname: ko.observable(''),
            whichzx: 0,
            movea: ko.observable(),
            moveb: ko.observable()
        },
        topClick: function () {
            $('#more-alert').modal('close');
            window.stock.loading(true);
            $.post('/ihanzhendata/selfStock/selfstock_istop', {
                uid: localStorage.uid,
                stock_code: moreModalVM.stockObj.scode(),
                is_top: 9
            }, function (data) {
                window.stock.loading(false);
                if (data.status == 1) {
                    noticeVM.notice(moreModalVM.stockObj.scode() + '置顶成功！');
                    noticeVM.show();
                    switch (moreModalVM.stockObj.whichzx) {
                        case 1: _this.tradeVM.tab.selectOneClick(); break;
                        case 2: _this.tradeVM.tab.selectTwoClick(); break;
                        case 3: _this.tradeVM.tab.selectThreeClick(); break;
                    }
                } else {
                    noticeVM.notice(moreModalVM.stockObj.scode() + '置顶失败！');
                    noticeVM.show();
                }
            }).error(function () {
                window.stock.loading(false);
                noticeVM.notice(moreModalVM.stockObj.scode() + '置顶失败！');
                noticeVM.show();
            });
        },
        bottomClick: function () {
            $('#more-alert').modal('close');
            window.stock.loading(true);
            $.post('/ihanzhendata/selfStock/selfstock_istop', {
                uid: localStorage.uid,
                stock_code: moreModalVM.stockObj.scode(),
                is_top: 0
            }, function (data) {
                window.stock.loading(false);
                if (data.status == 1) {
                    noticeVM.notice(moreModalVM.stockObj.scode() + '置底成功！');
                    noticeVM.show();
                    switch (moreModalVM.stockObj.whichzx) {
                        case 1: _this.tradeVM.tab.selectOneClick(); break;
                        case 2: _this.tradeVM.tab.selectTwoClick(); break;
                        case 3: _this.tradeVM.tab.selectThreeClick(); break;
                    }
                } else {
                    noticeVM.notice(moreModalVM.stockObj.scode() + '置底失败！');
                    noticeVM.show();
                }
            }).error(function () {
                window.stock.loading(false);
                noticeVM.notice(moreModalVM.stockObj.scode() + '置底失败！');
                noticeVM.show();
            });
        },
        deleteClick: function () {
            $('#more-alert').modal('close');
            window.stock.loading(true);
            $.ajax({
                url: '/ihanzhendata/selfStock/deleteSelfStock',
                method: 'POST',
                data: {
                    uid: localStorage.uid,
                    stock_code: moreModalVM.stockObj.scode()
                },
                success: function (result) {
                    window.stock.loading(false);
                    if (result && result.status == 1) {
                        noticeVM.notice('自选股删除成功！');
                        $('#notice-alert').modal('open');
                        switch (moreModalVM.stockObj.whichzx) {
                            case 1: _this.tradeVM.tab.selectOneClick(); break;
                            case 2: _this.tradeVM.tab.selectTwoClick(); break;
                            case 3: _this.tradeVM.tab.selectThreeClick(); break;
                        }
                    } else {
                        noticeVM.notice('自选股删除失败！');
                        $('#notice-alert').modal('open');
                    }
                },
                error: function () {
                    window.stock.loading(false);
                    noticeVM.notice('自选股删除失败！');
                    $('#notice-alert').modal('open');
                }
            });
        },
        moveClick: function (moveto, data, event) {
            $('#more-alert').modal('close');
            var b_zx = '';
            if (moveto == 'a') {
                b_zx = moreModalVM.stockObj.movea();
            } else if (moveto == 'b') {
                b_zx = moreModalVM.stockObj.moveb();
            }
            window.stock.loading(true);
            $.post('/ihanzhendata/selfStock/updateSelfStockB_zx', {
                uid: localStorage.uid,
                stock_code: moreModalVM.stockObj.scode(),
                b_zx: b_zx
            }, function (data) {
                window.stock.loading(false);
                if (data.status == 1) {
                    noticeVM.notice('移动自选股成功！');
                    $('#notice-alert').modal('open');
                    switch (moreModalVM.stockObj.whichzx) {
                        case 1: _this.tradeVM.tab.selectOneClick(); break;
                        case 2: _this.tradeVM.tab.selectTwoClick(); break;
                        case 3: _this.tradeVM.tab.selectThreeClick(); break;
                    }
                } else {
                    noticeVM.notice('移动自选股失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                window.stock.loading(false);
                noticeVM.notice('移动自选股失败！');
                $('#notice-alert').modal('open');
            });
        },
        detailsClick: function () {
            window.location.href = "stock_details.html?stockCode=" + moreModalVM.stockObj.scode() + "&stockName=" + moreModalVM.stockObj.sname();
        }
    };
    _this.settingVM = {
        firstMark: ko.observable(''),
        secondMark: ko.observable(''),
        thirdMark: ko.observable(''),
        confirmClick: function () {
            var bz1 = _this.settingVM.firstMark(),
                bz2 = _this.settingVM.secondMark(),
                bz3 = _this.settingVM.thirdMark();
            if (bz1 == "") {
                bz1 = "无备注";
            }
            if (bz2 == "") {
                bz2 = "无备注";
            }
            if (bz3 == "") {
                bz3 = "无备注";
            }
            if (bz1.length > 7 || bz2.length > 7 || bz3.length > 7) {
                noticeVM.notice('备注最多为7个字！');
                $('#notice-alert').modal('open');
                return;
            }
            window.stock.loading(true);
            $.post('/ihanzhendata/selfStock/updateSelfStockBz', {
                uid: localStorage.uid,
                s_zx1: bz1,
                s_zx2: bz2,
                s_zx3: bz3
            }, function (data) {
                window.stock.loading(false);
                if (data.status == 1) {
                    noticeVM.notice('备注保存成功！');
                    $('#notice-alert').modal('open');
                    localStorage.s_zx1 = bz1;
                    localStorage.s_zx2 = bz2;
                    localStorage.s_zx3 = bz3;
                    _this.tradeVM.tab.firstRemark(bz1);
                    _this.tradeVM.tab.secondRemark(bz2);
                    _this.tradeVM.tab.thirdRemark(bz3);
                }
                else {
                    window.stock.logmsg(data);
                    noticeVM.notice('备注保存失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                noticeVM.notice('备注保存失败！');
                $('#notice-alert').modal('open');
            });
        }
    }
    _this.tradeVM = new TradeVM();
    function TradeVM() {
        var _vm = this;
        _vm.tab = {
            firstRemark: ko.observable(''),
            secondRemark: ko.observable(''),
            thirdRemark: ko.observable(''),
            selectOneClick: function () {
                $('.nomore').hide();
                pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _vm.firstStocks([]);
                _this.getSelfStockWholeProcess(1);
            },
            selectTwoClick: function () {
                $('.nomore').hide();
                pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _vm.secondStocks([]);
                _this.getSelfStockWholeProcess(2);
            },
            selectThreeClick: function () {
                $('.nomore').hide();
                pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _vm.thirdStocks([]);
                _this.getSelfStockWholeProcess(3);
            }
        };
        _vm.firstStocks = ko.observableArray([]);
        _vm.secondStocks = ko.observableArray([]);
        _vm.thirdStocks = ko.observableArray([]);
    }
    function Stock(scode, sname, which) {
        this.scode = ko.observable(scode);
        this.sname = ko.observable(sname);
        this.isSelfSelect = ko.observable(false);
        this.isTechnology = ko.observable(false);
        this.isFundamental = ko.observable(false);
        this.isEvent = ko.observable(false);
        this.isMain = ko.observable(false);
        this.stars = ko.observable(0);
        this.whichzx = which;
        this.detailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
        this.moreClick = function (data) {
            moreModalVM.stockObj.sname(data.sname());
            moreModalVM.stockObj.scode(data.scode());
            moreModalVM.stockObj.whichzx = data.whichzx;
            switch (data.whichzx) {
                case 1: moreModalVM.stockObj.movea(2); moreModalVM.stockObj.moveb(3); break;
                case 2: moreModalVM.stockObj.movea(1); moreModalVM.stockObj.moveb(3); break;
                case 3: moreModalVM.stockObj.movea(1); moreModalVM.stockObj.moveb(2); break;
            }
            $('#more-alert').modal();
        }
    };
    _this.init = function () {
        ko.applyBindings(_this.tradeVM, $('#trade-container')[0]);
        ko.applyBindings(_this.settingVM, $('#setting-alert')[0]);
        ko.applyBindings(moreModalVM, $('#more-alert')[0]);
        _this.initPageData();
        _this.initEvent();
    };
    _this.getSelfStockWholeProcess = function (belongzx) {
        $('.loadspan').show();
        $.when(_this.getSelfStock(belongzx)).done(function (stockData) {
            $('.loadspan').hide();
            haslock = false;
            if (stockData && stockData.data && stockData.data.length > 0) {
                _this.processStockData(stockData.data, belongzx);
            } else if (stockData && stockData.data && stockData.data.length == 0) {
                $('.loadspan').hide();
                $(window).unbind('scroll');
                $('.nomore').show();
            }
            if (pageNumber == 2) {
                _this.getSelfStockWholeProcess(belongzx);
            }
        }).fail(function () {
            $('.loadspan').hide();
            haslock = false;
            pageNumber--;
            _this.getSelfStockWholeProcess(belongzx);
        });
    }
    _this.getSelfStock = function (belongzx) {
        haslock = true;
        return $.get('/ihanzhendata/selfStock/getSelfStock', {
            uid: localStorage.uid,
            b_zx: belongzx,
            pageNumber: pageNumber++
        }, function (data) { });
    };
    _this.processStockData = function (stockArr, belongzx) {
        if (stockArr.length > 0) {
            var tempStocks = [];
            for (var j = 0; j < stockArr.length; j++) {
                var scode = stockArr[j].stock_code,
                    sname = stockArr[j].stock_name;
                switch (belongzx) {
                    case 1: _this.tradeVM.firstStocks.push(new Stock(scode, sname, belongzx)); break;
                    case 2: _this.tradeVM.secondStocks.push(new Stock(scode, sname, belongzx)); break;
                    case 3: _this.tradeVM.thirdStocks.push(new Stock(scode, sname, belongzx)); break;
                }
                tempStocks.push(stockArr[j].stock_code);
            }
            getSelftSelectEvent(tempStocks);
            getLabelStars(tempStocks);
        }
    }
    _this.initPageData = function () {
        $('.loadspan').show();
        $.when(_this.getSelfBz(), _this.getSelfStock(1)).done(function (beizhuData, stockData) {
            $('.loadspan').hide();
            haslock = false;
            if (beizhuData && beizhuData[0].data) {
                var bzdata = beizhuData[0].data;
                localStorage.s_zx1 = bzdata.s_zx1;
                localStorage.s_zx2 = bzdata.s_zx2;
                localStorage.s_zx3 = bzdata.s_zx3;
                _this.tradeVM.tab.firstRemark(localStorage.s_zx1);
                _this.tradeVM.tab.secondRemark(localStorage.s_zx2);
                _this.tradeVM.tab.thirdRemark(localStorage.s_zx3);
            }
            if (stockData && stockData[0].data && stockData[0].data.length > 0) {
                _this.processStockData(stockData[0].data, 1);
            } else if (stockData && stockData[0].data && stockData[0].data.length == 0) {
                $('.loadspan').hide();
                $(window).unbind('scroll');
                $('.nomore').show();
            }
            _this.getSelfStockWholeProcess(1);
        }).fail(function () {
            $('.loadspan').hide();
            haslock = false;
            pageNumber = 1;
            _this.initPageData();
        });
    }
    _this.getSelfBz = function () {
        return $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) { });
    }
    _this.initEvent = function () {
        $("searchBtn").click(function () {
            window.location.href = "search.html";
        });
        $("#refreshBtn").click(function () {
            window.location.reload();
        });
        $("#settingBtn").click(function () {
            _this.settingVM.firstMark(localStorage.s_zx1);
            _this.settingVM.secondMark(localStorage.s_zx2);
            _this.settingVM.thirdMark(localStorage.s_zx3);
            $("#confirm-alert").modal();
        });
        //定义鼠标滚动事件  
        $(window).scroll(scrollHandler);
    }
    function array2urlstr(arr, codenameStr) {
        var tempArr = [];
        for (var i = 0; i < arr.length; i++) {
            var str = codenameStr + "=" + arr[i];
            tempArr.push(str);
        }
        return tempArr.join("&");
    }
    //查询 是否是技术面和基本面和星级
    function getLabelStars(arr) {
        $('.loadspan').show();
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stockslabel/?' + array2urlstr(arr, 'windcode'),
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                if (data && data.data) {
                    $('.loadspan').hide();
                    var stockList = data.data;
                    var tab = $('div.am-in.am-active')[0].id;
                    var tempArr = null;
                    switch (tab) {
                        case 'tab1': tempArr = _this.tradeVM.firstStocks; break;
                        case 'tab2': tempArr = _this.tradeVM.secondStocks; break;
                        case 'tab3': tempArr = _this.tradeVM.thirdStocks; break;
                    }
                    for (var i = 0; i < tempArr().length; i++) {
                        for (var j = 0; j < stockList.length; j++) {
                            if (tempArr()[i].scode() == stockList[j].windcode) {
                                tempArr()[i].isTechnology(Boolean(stockList[j].is_jishu));
                                tempArr()[i].isFundamental(Boolean(stockList[j].is_jiben));
                                tempArr()[i].isMain(Boolean(stockList[j].is_mf));
                                tempArr()[i].stars(stockList[j].stars);
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
                var tab = $('div.am-in.am-active')[0].id;
                var tempArr = null;
                switch (tab) {
                    case 'tab1': tempArr = _this.tradeVM.firstStocks; break;
                    case 'tab2': tempArr = _this.tradeVM.secondStocks; break;
                    case 'tab3': tempArr = _this.tradeVM.thirdStocks; break;
                }
                for (var i = 0; i < tempArr().length; i++) {
                    for (var j = 0; j < stockList.length; j++) {
                        if (tempArr()[i].scode() == stockList[j].stock_code) {
                            tempArr()[i].isSelfSelect(Boolean(parseInt(stockList[j].is_zxg)));
                            tempArr()[i].isEvent(Boolean(parseInt(stockList[j].is_logic)));
                            break;
                        }
                    }
                }
            }
        }).error(function () {
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
                _this.getSelfStockWholeProcess(parseInt(tab.substr(3)));
            }
        }
    }
    //==============上拉加载核心代码=============  
}
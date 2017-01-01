﻿$(function () {
    var tradeManagement = new TradeManagement();
    tradeManagement.init();
})
function TradeManagement() {
    var _this = this;
    _this.pageNumber = 1; //设置当前页数，全局变量  
    _this.codeList = [];//方块字属性和星级要用到
    var timeout;
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.mousedownVM = {
        stockObj: {
            scode: ko.observable(''),
            sname: ko.observable(''),
            whichzx: 0,
            movea: ko.observable(),
            moveb: ko.observable()
        },
        deleteClick: function () {
            $('#mousedown-alert').modal('close');
            window.stock.loading(true);
            $.ajax({
                url: '/ihanzhendata/selfStock/deleteSelfStock',
                method: 'POST',
                data: {
                    uid: localStorage.uid,
                    stock_code: _this.mousedownVM.stockObj.scode()
                },
                success: function (result) {
                    window.stock.loading(false);
                    if (result && result.status == 1) {
                        _this.noticeVM.notice('自选股删除成功！');
                        $('#notice-alert').modal('open');
                        switch (_this.mousedownVM.stockObj.whichzx) {
                            case 1: _this.tradeVM.tab.selectOneClick(); break;
                            case 2: _this.tradeVM.tab.selectTwoClick(); break;
                            case 3: _this.tradeVM.tab.selectThreeClick(); break;
                        }
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
        },
        moveClick: function (moveto, data, event) {
            $('#mousedown-alert').modal('close');
            var b_zx = '';
            if (moveto == 'a') {
                b_zx = _this.mousedownVM.stockObj.movea();
            } else if (moveto == 'b') {
                b_zx = _this.mousedownVM.stockObj.moveb();
            }
            window.stock.loading(true);
            $.post('/ihanzhendata/selfStock/updateSelfStockB_zx', {
                uid: localStorage.uid,
                stock_code: _this.mousedownVM.stockObj.scode(),
                b_zx: b_zx
            }, function (data) {
                window.stock.loading(false);
                if (data.status == 1) {
                    _this.noticeVM.notice('移动自选股成功！');
                    $('#notice-alert').modal('open');
                    switch (_this.mousedownVM.stockObj.whichzx) {
                        case 1: _this.tradeVM.tab.selectOneClick(); break;
                        case 2: _this.tradeVM.tab.selectTwoClick(); break;
                        case 3: _this.tradeVM.tab.selectThreeClick(); break;
                    }
                } else {
                    _this.noticeVM.notice('移动自选股失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                window.stock.loading(false);
                _this.noticeVM.notice('移动自选股失败！');
                $('#notice-alert').modal('open');
            });
        },
        settopClick: function () {
            //to do....置顶

        }
    }
    _this.settingVM = {
        firstMark: ko.observable(''),
        secondMark: ko.observable(''),
        thirdMark: ko.observable(''),
        confirmClick: function () {
            var bz1 = _this.settingVM.firstMark(),
                bz2 = _this.settingVM.secondMark(),
                bz3 = _this.settingVM.thirdMark();
            if (bz1 == "") {
                bz1="无备注";
            }
            if (bz2 == "") {
                bz2 = "无备注";
            }
            if (bz3 == "") {
                bz3 = "无备注";
            }
            if (bz1.length > 7 || bz2.length > 7 || bz3.length > 7) {
                _this.noticeVM.notice('备注最多为7个字！');
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
                    _this.noticeVM.notice('备注保存成功！');
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
                    _this.noticeVM.notice('备注保存失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                _this.noticeVM.notice('备注保存失败！');
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
                _this.pageNumber = 1; //设置当前页数，全局变量  
                _this.codeList = [];
                $(window).scroll(scrollHandler);
                _vm.firstStocks([]);
                _this.getSelfStockWholeProcess(1);
            },
            selectTwoClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                _this.codeList = [];
                $(window).scroll(scrollHandler);
                _vm.secondStocks([]);
                _this.getSelfStockWholeProcess(2);
            },
            selectThreeClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                _this.codeList = [];
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
        this.stars = ko.observable(0);
        this.whichzx = which;
        this.stockMouseDown = function (data, event) {
            timeout = setTimeout(function () {
                _this.mousedownVM.stockObj.sname(data.sname());
                _this.mousedownVM.stockObj.scode(data.scode());
                _this.mousedownVM.stockObj.whichzx = data.whichzx;
                switch (data.whichzx) {
                    case 1: _this.mousedownVM.stockObj.movea(2); _this.mousedownVM.stockObj.moveb(3); break;
                    case 2: _this.mousedownVM.stockObj.movea(1); _this.mousedownVM.stockObj.moveb(3); break;
                    case 3: _this.mousedownVM.stockObj.movea(1); _this.mousedownVM.stockObj.moveb(2); break;
                }
                $('#mousedown-alert').modal();
            }, 50);
            return false;
        },
        this.stockMouseOut = function (data, event) {
            clearTimeout(timeout);
        },
        this.stockMouseUp = function (data, event) {
            clearTimeout(timeout);
        },
        this.detailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
    };
    _this.init = function () {
        ko.applyBindings(_this.tradeVM, $('#trade-container')[0]);
        ko.applyBindings(_this.settingVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        ko.applyBindings(_this.mousedownVM, $('#mousedown-alert')[0]);
        _this.initPageData();
        _this.initEvent();
    };
    _this.getSelfStockWholeProcess = function (belongzx) {
        $('.loadspan').show();
        $.when(_this.getSelfStock(belongzx)).done(function (stockData) {
            $('.loadspan').hide();
            if (stockData && stockData.data&&stockData.data.length>0) {
                _this.processStockData(stockData.data, belongzx);
            } else if (stockData && stockData.data && stockData.data.length == 0) {
                $('.loadspan').hide();
                $(window).unbind('scroll');
                $('.nomore').show();
            }
        });
        if (_this.pageNumber == 2) {
            _this.getSelfStockWholeProcess(belongzx);
        }
    }
    _this.getSelfStock = function (belongzx) {
        return $.get('/ihanzhendata/selfStock/getSelfStock', {
            uid: localStorage.uid,
            b_zx: belongzx,
            pageNumber: _this.pageNumber++
        }, function (data) { });
    };
    _this.processStockData = function (stockArr, belongzx) {
        if (stockArr.length > 0) {
            for (var j = 0; j < stockArr.length; j++) {
                var scode = stockArr[j].stock_code,
                    sname = stockArr[j].stock_name;
                switch (belongzx) {
                    case 1: _this.tradeVM.firstStocks.push(new Stock(scode, sname, belongzx)); break;
                    case 2: _this.tradeVM.secondStocks.push(new Stock(scode, sname, belongzx)); break;
                    case 3: _this.tradeVM.thirdStocks.push(new Stock(scode, sname, belongzx)); break;
                }
                _this.codeList.push(stockArr[j].stock_code);
            }
            getSelftSelectEvent(_this.codeList);
            getLabelStars(_this.codeList);
        }
    }
    _this.initPageData = function () {
        window.stock.loading(true);
        $.when(_this.getSelfBz(), _this.getSelfStock(1)).done(function (beizhuData, stockData) {
            window.stock.loading(false);
            $('.loadspan').hide();
            if (beizhuData && beizhuData[0].data) {
                var bzdata = beizhuData[0].data;
                localStorage.s_zx1 = bzdata.s_zx1;
                localStorage.s_zx2 = bzdata.s_zx2;
                localStorage.s_zx3 = bzdata.s_zx3;
                _this.tradeVM.tab.firstRemark(localStorage.s_zx1);
                _this.tradeVM.tab.secondRemark(localStorage.s_zx2);
                _this.tradeVM.tab.thirdRemark(localStorage.s_zx3);
            }
            if (stockData && stockData[0].data&&stockData[0].data.length>0) {
                _this.processStockData(stockData[0].data, 1);
            } else if (stockData && stockData[0].data && stockData[0].data.length == 0) {
                $('.loadspan').hide();
                $(window).unbind('scroll');
                $('.nomore').show();
            }
        });
    }
    _this.getSelfBz = function () {
        window.stock.loading(true);
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
            //window.stock.loading(false);
            if (data && data.data) {
                var stockList = data.data;
                var tab = $('div.am-in.am-active')[0].id;
                var tempArr = null;
                switch (tab) {
                    case 'tab1':tempArr=_this.tradeVM.firstStocks ;break;
                    case 'tab2':tempArr=_this.tradeVM.secondStocks ; break;
                    case 'tab3': tempArr=_this.tradeVM.thirdStocks ;break;
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
            var tab = $('div.am-in.am-active')[0].id;
            _this.getSelfStockWholeProcess(tab.substr(3));
        }
    }
    //==============上拉加载核心代码=============  
}
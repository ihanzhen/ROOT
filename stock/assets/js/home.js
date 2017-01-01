$(function () {
    var homeManagement = new HomeManagement();
    homeManagement.init();
})
function HomeManagement() {
    var _this = this;
    var homeVM = new HomeVM();
    function Zhishu(name) {
        this.zhishuName = ko.observable(name);
        this.currentPrice = ko.observable('');
        this.absoluteChange = ko.observable('');
        this.relativeChange = ko.observable('');
    }
    function Board() {
        this.boardName = ko.observable('');
        this.change = ko.observable('');
        this.headStock = ko.observable('');
    }
    function Guchi() {
        this.stockName = ko.observable('');
        this.change = ko.observable('');
        this.guchi = ko.observable('');
    }
    function HomeVM() {
        _vm = this;
        _vm.sliderVM = {
            zhishuItems: ko.observableArray([]),
            boardItems: ko.observableArray([]),
            guchiItems: ko.observableArray([]),
        }
        _vm.proposalPredictionsVM = {
            position: ko.observable(''),
            prediction: ko.observable(''),
            updataTime: ko.observable('')
        }
        _vm.iconVM = {
            dapanClick: function () {
                window.location.href = "dapan.html";
            },
            bankuaiClick: function () {
                window.location.href = "bankuai.html";
            },
            recommendStocksClick: function () {
                window.location.href = "tuijian_jishu.html";
            },
            backtestingClick: function () {
                //window.location.href = "dapan.html";
            },
            assetsManagementClick: function () {
                //window.location.href = "dapan.html";
            },
            selectedStocksClick: function () {
                window.location.href = "tuijian_jiben.html";
            },
            globalPredictClick: function () {
                window.location.href = "globle_markets.html";
            },
            captialCurveClick: function () {
                //window.location.href = "dapan.html";
            },
            customStocksClick: function () {
                window.location.href = "tuijian_shijian.html";
            }
        }
    }
    _this.getPrice = function (datastr, nth) {
        return parseFloat(datastr.split(',')[nth]).toFixed(2);
    }
    _this.updateSingleStock = function (guchiNth, scode) {
        var parameter = 's_' + scode.substring(7, 9).toLowerCase() + scode.substring(0, 6);
        $.ajax({
            cache: true,
            url: "http://hq.sinajs.cn/list=" + parameter,
            type: 'GET',
            dataType: 'script',
            timeout: 2000,
            success: function (data, textStatus, jqXHR) {
                var obj = eval('hq_str_' + parameter);
                if (obj) {
                    homeVM.sliderVM.guchiItems()[guchiNth].change(_this.getPrice(obj, 3));
                }
            }
        });
    }
    _this.updateZhishuAsync = function () {
        $.ajax({
            cache: true,
            url: "http://hq.sinajs.cn/list=s_sh000001,s_sz399905,s_sz399006",
            type: 'GET',
            dataType: 'script',
            timeout: 2000,
            success: function (data, textStatus, jqXHR) {
                var resultArr = [];
                resultArr.push(eval('hq_str_s_sh000001'));
                resultArr.push(eval('hq_str_s_sz399905'));
                resultArr.push(eval('hq_str_s_sz399006'));
                for (var i = 0; i < 3; i++) {
                    var arr = [];
                    arr.push(_this.getPrice(resultArr[i], 1));//最新价
                    arr.push(_this.getPrice(resultArr[i], 2));//涨跌额
                    arr.push(_this.getPrice(resultArr[i], 3));//涨跌幅
                    if (arr[0] != homeVM.sliderVM.zhishuItems()[i].currentPrice()) {
                        //$($('.zhishuNum')[index]).css('background-color', '#444');
                        //setTimeout(function () {
                        //    $($('.zhishuNum')[index]).css('background-color', '#3d3d3d');
                        //}, 500);
                        homeVM.sliderVM.zhishuItems()[i].currentPrice(arr[0]);
                        homeVM.sliderVM.zhishuItems()[i].absoluteChange(arr[1]);
                        homeVM.sliderVM.zhishuItems()[i].relativeChange(arr[2] + '%');
                    }
                }
            }
        });
    }
    var processRecommendBoard = function () {
        $.get('/ihanzhendata/stock/recommendPlate_Stock', function (data) {
            if (data && data.data && data.data.length > 0) {
                var boardlist = data.data;
                var boardcode = boardlist[0].plate_id;
                homeVM.sliderVM.boardItems()[0].boardName(boardlist[0].plate_name);
                if (boardlist[0].type == "强势版块") {
                    $.ajax({
                        url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/0',
                        contentType: "application/javascript",
                        dataType: "jsonp",
                        jsonpcallback: "jsonpcallback",
                        timeout: 5000,
                        type: "GET",
                        success: function (data) {
                            if (data && data.data && data.data.length > 0) {
                                var boardlist = data.data;
                                for (var i = 0; i < boardlist.length; i++) {
                                    if (boardcode == boardlist[i].windcode) {
                                        homeVM.sliderVM.boardItems()[0].boardName(boardlist[i].name);
                                        homeVM.sliderVM.boardItems()[0].change(boardlist[i].pct.toFixed(2));
                                        if (boardlist[i].stocklist) {
                                            homeVM.sliderVM.boardItems()[0].headStock(boardlist[i].stocklist[0].name);
                                        } else {
                                            homeVM.sliderVM.boardItems()[0].headStock('--');
                                        }
                                    }
                                }
                            }
                        }
                    });
                } else if (boardlist[0].type == "蓄势版块") {
                    $.ajax({
                        url: 'http://119.164.253.142:3307/api/v1.0/stocksboardready/0',
                        contentType: "application/javascript",
                        dataType: "jsonp",
                        jsonpcallback: "jsonpcallback",
                        timeout: 5000,
                        type: "GET",
                        success: function (data) {
                            if (data && data.data && data.data.length > 0) {
                                var boardlist = data.data;
                                for (var i = 0; i < boardlist.length; i++) {
                                    if (boardcode == boardlist[i].windcode) {
                                        homeVM.sliderVM.boardItems()[0].boardName(boardlist[i].name);
                                        homeVM.sliderVM.boardItems()[0].change(boardlist[i].pct.toFixed(2));
                                        if (boardlist[i].stocklist) {
                                            homeVM.sliderVM.boardItems()[0].headStock(boardlist[i].stocklist[0].name);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

            }
        });
    }
    _this.updateBoardAsync = function (index) {
        switch (index) {
            case 0: processRecommendBoard(); return;
            case 1: url = 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/1'; break;
            case 2: url = 'http://119.164.253.142:3307/api/v1.0/stocksboardready/1'; break;
        }
        $.ajax({
            url: url,
            contentType: "application/javascript",
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                if (data && data.data && data.data.length > 0) {
                    var boardlist = data.data;
                    homeVM.sliderVM.boardItems()[index].boardName(boardlist[0].name);
                    homeVM.sliderVM.boardItems()[index].change(boardlist[0].pct.toFixed(2));
                    if (boardlist[0].stocklist) {
                        homeVM.sliderVM.boardItems()[index].headStock(boardlist[0].stocklist[0].name);
                    } else {
                        homeVM.sliderVM.boardItems()[index].headStock('--');
                    }
                }
            }
        });
    }
    var processShijianGuchi = function () {
        $.get('/ihanzhendata/logicstocks/' + localStorage.uid + '/1', function (data) {
            if (data && data.data && data.data.length > 0) {
                var stock = data.data[0];
                homeVM.sliderVM.guchiItems()[2].stockName(stock.stock_name);
                homeVM.sliderVM.guchiItems()[2].guchi("事件驱动");
                _this.updateSingleStock(2, stock.stock_code);
            }
        });
    }
    _this.updateGuchiAsync = function (index) {
        switch (index) {
            case 0: url = 'http://119.164.253.142:3307/api/v1.0/stocksstrong/1'; break;
            case 1: url = 'http://119.164.253.142:3307/api/v1.0/stocksbasiclist/1'; break;
            case 2: processShijianGuchi(); return;
        }
        $.ajax({
            url: url,
            contentType: "application/javascript",
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                if (data && data.data && data.data.length > 0) {
                    var stock = data.data[0];
                    homeVM.sliderVM.guchiItems()[index].stockName(stock.name);
                    homeVM.sliderVM.guchiItems()[index].guchi(index == 0 ? "技术面" : "基本面");
                    _this.updateSingleStock(index, stock.windcode);
                }
            }
        });
    }
    _this.init = function () {
        ko.applyBindings(homeVM, $("#home-container")[0]);
        _this.getPageData();
        homeVM.sliderVM.zhishuItems.push(new Zhishu("上证指数"))
        homeVM.sliderVM.zhishuItems.push(new Zhishu("中证500"));
        homeVM.sliderVM.zhishuItems.push(new Zhishu("创业板指"));
        for (var i = 0; i < 3; i++) {
            homeVM.sliderVM.boardItems.push(new Board());
            homeVM.sliderVM.guchiItems.push(new Guchi());
        }
        _this.updateBoardAsync(0);
        _this.updateBoardAsync(1);
        _this.updateBoardAsync(2);
        _this.updateGuchiAsync(0);
        _this.updateGuchiAsync(1);
        _this.updateGuchiAsync(2);
        var int1 = self.setInterval(_this.updateZhishuAsync(Math.floor(Math.random() * 3)), 5000);
        var int2 = self.setInterval(_this.updateBoardAsync(Math.floor(Math.random() * 3)), 5000);
        var int2 = self.setInterval(_this.updateGuchiAsync(Math.floor(Math.random() * 3)), 5000);
    }
    _this.proposalPredictionAjax = function () {
        window.stock.loading(true);
        return $.get('/ihanzhendata/stock/main_position');
    }
    _this.getPageData = function () {
        $.when(_this.proposalPredictionAjax(), _this.updateZhishuAsync()).done(function (proposalResult) {
            window.stock.loading(false);
            var proposalData = proposalResult[0].data;
            homeVM.proposalPredictionsVM.position(proposalData.main_position + '%');
            homeVM.proposalPredictionsVM.prediction(proposalData.main_tendency);
            var arr = proposalData.updatetime.split(/[- : ]/);
            var updateTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
            var nowTime = new Date();
            var past = parseInt(nowTime.getTime()) - parseInt(updateTime.getTime());
            if (past / 1000 < 60) {
                homeVM.proposalPredictionsVM.updataTime(Math.floor(past / 1000).toString() + "秒");
            } else if (past / 1000 / 60 < 60) {
                homeVM.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60).toString() + "分钟");
            } else if (past / 1000 / 60 / 60 < 24) {
                homeVM.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60).toString() + "小时");
            } else if (past / 1000 / 60 / 60 / 24 < 30) {
                homeVM.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60 / 24).toString() + "天");
            } else if (past / 1000 / 60 / 60 / 24 / 30 < 12) {
                homeVM.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60 / 24 / 30).toString() + "月");
            } else {
                homeVM.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60 / 24 / 30 / 12).toString() + "年");
            }
        }).fail(function () {
            window.stock.loading(false);
            console.log('fail');
        });
    }

}


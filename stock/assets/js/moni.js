$(function () {
    var moniPage = new MoniPage();
    moniPage.init();
})
var MoniPage = function () {
    var _this = this;
    _this.pageNumber = 1;
    var pageSize = 10;
    _this.moniVM = new MoniVM();
    _this.priceVM = new PriceModelVM();
    _this.confirmVM = {
        stockCode: ko.observable(''),
        stockName: ko.observable(''),
        price: ko.observable(0),
        count: ko.observable(100),
        question: ko.observable(''),
        ajaxItem: {},
        cancelClick: function () { },
        confirmClick: function () {
            var item = _this.confirmVM.ajaxItem, url = '';
            $('#my-modal-loading').modal('open');
            if (item.sorder_status == '10' || item.sorder_status == '11') {
                url = '/ihanzhendata/stockOrderMn/buyStock';//buy
            }
            else if (item.sorder_status == '20' || item.sorder_status == '21') {
                url = '/ihanzhendata/stockOrderMn/sellStock';//sale
            }
            $.post(url, item, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    switch (item.sorder_status) {
                        case '10': noticeVM.notice('买入委托成功！'); break;
                        case '11': noticeVM.notice('买入撤单成功！'); break;
                        case '13': noticeVM.notice('买入部分撤单成功！'); break;
                        case '20': noticeVM.notice('卖出委托成功！'); break;
                        case '21': noticeVM.notice('卖出撤单成功！'); break;
                        case '23': noticeVM.notice('卖出部分撤单成功！'); break;
                    }
                    if ($('li.am-active>a')[0].id == 't3') {
                        $.when(_this.queryBuyAndSell(undefined, undefined, 1, pageSize)).done(function (cancelData) {
                            _this.moniVM.cancelVM.items([]);
                            //处理从后台获取的撤单Tab页面的列表数据
                            _this.processCancelListData(cancelData.data);
                        });
                    }
                } else {
                    switch (item.sorder_status) {
                        case '10': noticeVM.notice('买入委托失败！'); break;
                        case '11': noticeVM.notice('买入撤单失败！'); break;
                        case '13': noticeVM.notice('买入部分撤单失败！'); break;
                        case '20': noticeVM.notice('卖出委托失败！'); break;
                        case '21': noticeVM.notice('卖出撤单失败！'); break;
                        case '23': noticeVM.notice('卖出部分撤单失败！'); break;
                    }
                }
                $('#notice-alert').modal('open');
            }).error(function () {
                $('#my-modal-loading').modal('close');
                switch (item.sorder_status) {
                    case '10': noticeVM.notice('买入委托失败！'); break;
                    case '11': noticeVM.notice('买入撤单失败！'); break;
                    case '13': noticeVM.notice('买入部分撤单失败！'); break;
                    case '20': noticeVM.notice('卖出委托失败！'); break;
                    case '21': noticeVM.notice('卖出撤单失败！'); break;
                    case '23': noticeVM.notice('卖出部分撤单失败！'); break;
                }
                $('#notice-alert').modal('open');
            });
        }
    }
    function PriceModelVM() {
        this.priceType = ko.observable('');
        this.items = ko.observableArray([]);
    };
    function Price(order, price, countLabel, count) {
        var that = this;
        that.price = ko.observable(price);
        that.order = ko.observable(order);
        that.countLabel = ko.observable(countLabel);
        that.count = ko.observable(count);
        that.priceClick = function (item) {
            var tab = $('li.am-active>a')[0].id;
            if (tab == 't1') {
                _this.moniVM.buyVM.inputPrice(item.price());
                _this.moniVM.buyVM.message('当前价格最多能买' + item.count() + '手');
            }
            else if (tab == 't2') {
                _this.moniVM.saleVM.inputPrice(item.price());
            }
            $('#price-modal').modal('close');
        }
    }
    function DealVM() {
        var _vm = this;
        _vm.stockCode = ko.observable('');
        _vm.stockName = ko.observable('');
        _vm.stockLabel = ko.observable('');
        _vm.inputPrice = ko.observable(0);
        _vm.inputCount = ko.observable(100);
        _vm.message = ko.observable('');
        _vm.items = ko.observableArray([]);//dealList
        _vm.getRecommendClick = function (dealType) {
            if (dealType == 'buy') {
                if (_this.moniVM.buyVM.stockCode() == '') {
                    noticeVM.notice('请输入股票名称');
                    $('#notice-alert').modal('open');
                    return;
                }
                $('#my-modal-loading').modal('open');
                var parameter = _this.moniVM.buyVM.stockCode().substring(7, 9).toLowerCase() + _this.moniVM.buyVM.stockCode().substring(0, 6);
                var url = 'http://hq.sinajs.cn/list=' + parameter;
                $.ajax({
                    cache: true,
                    url: url,
                    type: 'GET',
                    dataType: 'script',
                    timeout: 2000,
                    success: function (data, textStatus, jqXHR) {
                        $('#my-modal-loading').modal('close');
                        _this.priceVM.priceType('卖单盘口');
                        var resultArr = eval('hq_str_' + parameter).split(',');
                        _this.priceVM.items.push(new Price('涨停', (resultArr[2] * 1.1).toFixed(3), '', ''));
                        _this.priceVM.items.push(new Price('卖一', resultArr[21], '挂单量', resultArr[20]));
                        _this.priceVM.items.push(new Price('卖二', resultArr[23], '挂单量', resultArr[22]));
                        _this.priceVM.items.push(new Price('卖三', resultArr[25], '挂单量', resultArr[24]));
                        _this.priceVM.items.push(new Price('卖四', resultArr[27], '挂单量', resultArr[26]));
                        _this.priceVM.items.push(new Price('卖五', resultArr[29], '挂单量', resultArr[28]));
                        _this.priceVM.items.push(new Price('跌停', (resultArr[2] * 0.9).toFixed(3), '', ''));
                        $('#price-modal').modal();
                    }
                });
            }
            else if (dealType == 'sale') {
                if (_this.moniVM.saleVM.stockCode() == '') {
                    noticeVM.notice('请输入股票名称');
                    $('#notice-alert').modal('open');
                    return;
                }
                $('#my-modal-loading').modal('open');
                var parameter = _this.moniVM.saleVM.stockCode().substring(7, 9).toLowerCase() + _this.moniVM.saleVM.stockCode().substring(0, 6);
                var url = 'http://hq.sinajs.cn/list=' + parameter;
                $.ajax({
                    cache: true,
                    url: url,
                    type: 'GET',
                    dataType: 'script',
                    timeout: 2000,
                    success: function (data, textStatus, jqXHR) {
                        $('#my-modal-loading').modal('close');
                        _this.priceVM.priceType('买单盘口');
                        var resultArr = eval('hq_str_' + parameter).split(',');
                        _this.priceVM.items.push(new Price('涨停', (resultArr[2] * 1.1).toFixed(3), '', ''));
                        _this.priceVM.items.push(new Price('买一', resultArr[11], '挂单量', resultArr[10]));
                        _this.priceVM.items.push(new Price('买二', resultArr[13], '挂单量', resultArr[12]));
                        _this.priceVM.items.push(new Price('买三', resultArr[15], '挂单量', resultArr[14]));
                        _this.priceVM.items.push(new Price('买四', resultArr[17], '挂单量', resultArr[16]));
                        _this.priceVM.items.push(new Price('买五', resultArr[19], '挂单量', resultArr[18]));
                        _this.priceVM.items.push(new Price('跌停', (resultArr[2] * 0.9).toFixed(3), '', ''));
                        $('#price-modal').modal();
                    }
                });
            }
            _this.priceVM.items([]);
        }
        _vm.dealClick = function (dealType) {//点击买入或卖出操作
            if (dealType == 'buy') {
                if (!_this.moniVM.buyVM.stockCode()) {
                    noticeVM.notice('请输入股票名称');
                    $('#notice-alert').modal('open');
                } else if (!_this.moniVM.buyVM.inputPrice()) {
                    noticeVM.notice('请输入价格');
                    $('#notice-alert').modal('open');
                } else if (!_this.moniVM.buyVM.inputCount()) {
                    noticeVM.notice('请输入手数');
                    $('#notice-alert').modal('open');
                } else if (_this.moniVM.buyVM.inputCount() < 100) {
                    noticeVM.notice('数量不能小于100');
                    $('#notice-alert').modal('open');
                } else if (_this.moniVM.saleVM.inputCount() % 100 != 0) {
                    noticeVM.notice('数量必须是100的整数倍');
                    $('#notice-alert').modal('open');
                } else if (_this.priceVM.items()[0].price() && parseFloat(_this.moniVM.buyVM.inputPrice()) > parseFloat(_this.priceVM.items()[0].price()) || parseFloat(_this.moniVM.buyVM.inputPrice()) < parseFloat(_this.priceVM.items()[6].price())) {
                    noticeVM.notice('超过涨跌限制[' + _this.priceVM.items()[6].price() + '-' + _this.priceVM.items()[0].price() + ']');
                    $('#notice-alert').modal('open');
                }
                else {
                    _this.confirmVM.stockCode(_this.moniVM.buyVM.stockCode());
                    _this.confirmVM.stockName(_this.moniVM.buyVM.stockName());
                    _this.confirmVM.price(_this.moniVM.buyVM.inputPrice());
                    _this.confirmVM.count(_this.moniVM.buyVM.inputCount());
                    _this.confirmVM.question('您是否确认以上买入委托？');
                    _this.confirmVM.ajaxItem = {
                        uid: localStorage.uid,//fake data
                        sorder_id: '',
                        stock_code: _this.moniVM.buyVM.stockCode(),
                        stock_name: _this.moniVM.buyVM.stockName(),
                        sorder_buy_price: _this.moniVM.buyVM.inputPrice(),
                        sorder_buy_amount: _this.moniVM.buyVM.inputCount(),
                        sorder_status: '10'
                    };
                    $('#weituo-alert').modal('open');
                }
            }
            else if (dealType == 'sale') {
                if (!_this.moniVM.saleVM.stockCode()) {
                    noticeVM.notice('请输入股票名称');
                    $('#notice-alert').modal('open');
                } else if (!_this.moniVM.saleVM.inputPrice()) {
                    noticeVM.notice('请输入价格');
                    $('#notice-alert').modal('open');
                } else if (!_this.moniVM.saleVM.inputCount()) {
                    noticeVM.notice('请输入手数');
                    $('#notice-alert').modal('open');
                } else if (_this.moniVM.saleVM.inputCount() < 100) {
                    noticeVM.notice('数量不能小于100');
                    $('#notice-alert').modal('open');
                } else if (_this.moniVM.saleVM.inputCount() % 100 != 0) {
                    noticeVM.notice('数量必须是100的整数倍');
                    $('#notice-alert').modal('open');
                } else if (_this.priceVM.items()[0].price() && parseFloat(_this.moniVM.saleVM.inputPrice()) > parseFloat(_this.priceVM.items()[0].price()) || parseFloat(_this.moniVM.saleVM.inputPrice()) < parseFloat(_this.priceVM.items()[6].price())) {
                    noticeVM.notice('超过涨跌限制[' + _this.priceVM.items()[6].price() + '-' + _this.priceVM.items()[0].price() + ']');
                    $('#notice-alert').modal('open');
                } else {
                    _this.confirmVM.stockCode(_this.moniVM.saleVM.stockCode());
                    _this.confirmVM.stockName(_this.moniVM.saleVM.stockName());
                    _this.confirmVM.price(_this.moniVM.saleVM.inputPrice());
                    _this.confirmVM.count(_this.moniVM.saleVM.inputCount());
                    _this.confirmVM.question('您是否确认以上卖出委托？');
                    _this.confirmVM.ajaxItem = {
                        uid: localStorage.uid,//fake data
                        sorder_id: '',
                        stock_code: _this.moniVM.saleVM.stockCode(),
                        stock_name: _this.moniVM.saleVM.stockName(),
                        sorder_sell_price: _this.moniVM.saleVM.inputPrice(),
                        sorder_sell_amount: _this.moniVM.saleVM.inputCount(),
                        sorder_status: '20'
                    };
                    $('#weituo-alert').modal('open');
                }
            }
        }
    }
    function DealList(scode, sname, svalue, absprofit, relprofit, holdPosition, availablePosition, costPrice, currentPrice) {
        this.scode = ko.observable(scode);
        this.sname = ko.observable(sname);
        this.svalue = ko.observable(svalue);
        this.absprofit = ko.observable(absprofit);
        this.relprofit = ko.observable(relprofit);
        this.holdPosition = ko.observable(holdPosition);
        this.availablePosition = ko.observable(availablePosition);
        this.costPrice = ko.observable(costPrice);
        this.currentPrice = ko.observable(currentPrice);
        this.listItemClick = function (item) {
            if ($('li.am-active>a')[0].id == 't1') {
                //buy
                _this.moniVM.buyVM.stockCode(item.scode());
                _this.moniVM.buyVM.stockName(item.sname());
                _this.moniVM.buyVM.stockLabel(item.scode() + '  ' + item.sname());
                //获取建议手数
                $('#my-modal-loading').modal('open');
                var parameter = 's_' + _this.moniVM.buyVM.stockCode().substring(7, 9).toLowerCase() + _this.moniVM.buyVM.stockCode().substring(0, 6);
                $.ajax({
                    cache: true,
                    url: 'http://hq.sinajs.cn/list=' + parameter,
                    type: 'GET',
                    dataType: 'script',
                    timeout: 2000,
                    success: function (data, textStatus, jqXHR) {
                        var resultArr = eval('hq_str_' + parameter).split(',');
                        $.when(_this.proposalPredictionAjax(), _this.queryUserAsset(), _this.querySorder()).done(function (data, asset, stock) {
                            $('#my-modal-loading').modal('close');
                            var stockArr = stock[0].data;
                            var stockValue = 0;
                            for (var i = 0; i < stockArr.length; i++) {
                                if (stockArr[i].stock_code == _this.moniVM.buyVM.stockCode()) {
                                    stockValue = stockArr[i].average_price * stockArr[i].sorder_position_amount;
                                }
                            }
                            var recommendCount = Math.floor(((asset[0].data.user_asset * data[0].data.main_position / 100 - stockValue) / resultArr[1]) / 100) * 100;
                            if (recommendCount > 0) {
                                _this.moniVM.buyVM.inputCount(recommendCount);
                            }
                            else {
                                noticeVM.notice('仓位过重，不建议购买！');
                                $('#notice-alert').modal('open');
                            }
                        }).fail(function () {
                            $('#my-modal-loading').modal('close');
                            //console.log('fail');
                        });
                    }
                });
            }
            else if ($('li.am-active>a')[0].id == 't2') {
                //sale
                _this.moniVM.saleVM.stockCode(item.scode());
                _this.moniVM.saleVM.stockName(item.sname());
                _this.moniVM.saleVM.stockLabel(item.scode() + '  ' + item.sname());
                //获取建议手数
                $('#my-modal-loading').modal('open');
                $.when(_this.querySorder()).done(function (data) {
                    $('#my-modal-loading').modal('close');
                    var stockArr = data.data;
                    for (var i = 0; i < stockArr.length; i++) {
                        if (stockArr[i].stock_code == _this.moniVM.saleVM.stockCode()) {
                            _this.moniVM.saleVM.inputCount(stockArr[i].sorder_avaliable_amount);
                            _this.moniVM.saleVM.message('最多能卖' + stockArr[i].sorder_avaliable_amount + '手');
                        }
                    }
                }).fail(function () {
                    $('#my-modal-loading').modal('close');
                });
            }
        }
    }
    function CancelList(sorderId, dealType, scode, sname, delegateTime, delegatePrice, averagePrice, delegateCount, dealCount, status, statusText) {
        this.sorderId = sorderId;
        this.dealType = ko.observable(dealType);
        this.stockCode = scode;
        this.stockName = ko.observable(sname);
        this.time = ko.observable(delegateTime);
        this.delegatePrice = ko.observable(delegatePrice);
        this.averagePrice = ko.observable(averagePrice);
        this.delegateCount = ko.observable(delegateCount);
        this.dealCount = ko.observable(dealCount);
        this.status = ko.observable(status);
        this.statusText = ko.observable(statusText);
        this.hasMarked = ko.observable(false);
        this.listClick = function (item) {
            if (item.status() != '10' && item.status() != '20' && item.status() != '12' && item.status() != '22') {
                return;
            }
            _this.confirmVM.stockCode(item.stockCode);
            _this.confirmVM.stockName(item.stockName());
            _this.confirmVM.price(item.delegatePrice());
            _this.confirmVM.count(item.delegateCount());
            _this.confirmVM.question('您是否确认以上撤单？');
            if (item.status() == '10' || item.status() == '12') {
                //进行买入撤单操作
                _this.confirmVM.ajaxItem = {
                    uid: localStorage.uid,//fake data
                    sorder_id: item.sorderId,
                    stock_code: item.stockCode,
                    stock_name: item.stockName(),
                    sorder_buy_price: item.delegatePrice(),
                    sorder_buy_amount: item.delegateCount(),
                    sorder_status: '11'
                }
            }
            else if (item.status() == '20' || item.status() == '22') {
                //进行卖出撤单操作
                _this.confirmVM.ajaxItem = {
                    uid: localStorage.uid,//fake data
                    sorder_id: item.sorderId,
                    stock_code: item.stockCode,
                    stock_name: item.stockName(),
                    sorder_sell_price: item.delegatePrice(),
                    sorder_sell_amount: item.delegateCount(),
                    sorder_status: '21'
                };
            }
            $('#weituo-alert').modal();
        };
        this.searchItemClick = function (item) {
            window.location.href = "order_memo.html?sorderId=" + item.sorderId + "&status=" + item.status();
        };
    }
    function MoniVM() {
        var _vm = this;
        _vm.tabVM = {
            buyClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _this.moniVM.buyVM.items([]);
                _this.getDealListData();
            },
            saleClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _this.moniVM.saleVM.items([]);
                _this.getDealListData();
            },
            cancelClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _this.moniVM.cancelVM.items([]);
                _this.getCancelListData();
            },
            holdClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _this.moniVM.holdVM.items([]);
                $('#my-modal-loading').modal('open');
                $.when(_this.queryUserAsset()).done(function (assetData) {
                    $('#my-modal-loading').modal('close');
                    //处理持仓Tab页面上部分列表数据
                    _this.processUserAssetData(assetData.data);
                });
                _this.getDealListData();
            },
            searchClick: function () {
                $('.nomore').hide();
                _this.pageNumber = 1; //设置当前页数，全局变量  
                $(window).scroll(scrollHandler);
                _this.moniVM.searchVM.items([]);
                _this.getSearchListData();
            },
            profitClick: function () {
                $('#my-modal-loading').modal('open');
                $.when(_this.queryUserDayProfit()).done(function (profitData) {
                    $('#my-modal-loading').modal('close');
                    //处理收益Tab页面折线图数据
                    _this.processDayProfitData(profitData.data);
                }).fail(function () {
                    $('#my-modal-loading').modal('close');
                });
            }
        };
        _vm.buyVM = new DealVM();
        _vm.saleVM = new DealVM();
        _vm.cancelVM = {
            items: ko.observableArray([])//cancelList
        };
        _vm.holdVM = {
            totalAssets: ko.observable(0),
            totalProfit: ko.observable(''),
            monthTrade: ko.observable(0),
            monthProfit: ko.observable(''),
            successRatio: ko.observable(''),
            weekProfit: ko.observable(''),
            marketValue: ko.observable('--'),
            availableAssets: ko.observable('--'),
            floatProfit: ko.observable('--'),
            items: ko.observableArray([])//dealList
        };
        _vm.searchVM = {
            beginDate: ko.observable(''),
            endDate: ko.observable(''),
            items: ko.observableArray([]),//cancelList
            searchClick: function () {
                if (!_this.moniVM.searchVM.beginDate() || !_this.moniVM.searchVM.endDate()) {
                    noticeVM.notice('请输入起始日期和结束日期');
                    $('#notice-alert').modal('open');
                } else if (new Date(_this.moniVM.searchVM.beginDate()) > new Date(_this.moniVM.searchVM.endDate())) {
                    noticeVM.notice('起始日期应该小于结束日期');
                    $('#notice-alert').modal('open');
                } else {
                    var inputEnd = new Date(_this.moniVM.searchVM.endDate());
                    var end = new Date(inputEnd.setDate(inputEnd.getDate() + 1));
                    $('#my-modal-loading').modal('open');
                    $.when(_this.queryBuyAndSell(_this.moniVM.searchVM.beginDate(), end.Format('YYYY-MM-DD'), 1, pageSize)).done(function (data) {
                        $('#my-modal-loading').modal('close');
                        _this.moniVM.searchVM.items([]);
                        _this.processCancelListData(data.data);
                    }).fail(function () {
                        $('#my-modal-loading').modal('close');
                        console.log('search fail');
                    });
                }
            }
        };
        _vm.profitVM = {
            beginDate: ko.observable(''),
            endDate: ko.observable(''),
            searchClick: function () {
                $('#my-modal-loading').modal('open');
                $.when(_this.queryUserDayProfit(_this.moniVM.profitVM.beginDate(), _this.moniVM.profitVM.endDate())).done(function (profitData) {
                    $('#my-modal-loading').modal('close');
                    _this.processDayProfitData(profitData.data);
                });
            }
        }
    }
    _this.initStockCode = function () {
        $('#autocomplete-ajax').autocomplete({
            minChars: 1,
            serviceUrl: '/ihanzhendata/stock/matchStocks',
            onSelect: function (suggestion) {
                _this.moniVM.buyVM.inputPrice(0);
                _this.moniVM.buyVM.message('');
                _this.moniVM.buyVM.stockLabel(suggestion.value + "  " + suggestion.data);
                _this.moniVM.buyVM.stockCode(suggestion.value);
                _this.moniVM.buyVM.stockName(suggestion.data);
                //获取建议手数
                $('#my-modal-loading').modal('open');
                var parameter = 's_' + _this.moniVM.buyVM.stockCode().substring(7, 9).toLowerCase() + _this.moniVM.buyVM.stockCode().substring(0, 6);
                $.ajax({
                    cache: true,
                    url: 'http://hq.sinajs.cn/list=' + parameter,
                    type: 'GET',
                    dataType: 'script',
                    timeout: 2000,
                    success: function (data, textStatus, jqXHR) {
                        var resultArr = eval('hq_str_' + parameter).split(',');
                        $.when(_this.proposalPredictionAjax(), _this.queryUserAsset(), _this.querySorder()).done(function (data, asset, stock) {
                            $('#my-modal-loading').modal('close');
                            var stockArr = stock[0].data;
                            var stockValue = 0;
                            for (var i = 0; i < stockArr.length; i++) {
                                if (stockArr[i].stock_code == _this.moniVM.buyVM.stockCode()) {
                                    stockValue = stockArr[i].average_price * stockArr[i].sorder_position_amount;
                                }
                            }
                            var recommendCount = Math.floor(((asset[0].data.user_asset * data[0].data.main_position / 100 - stockValue) / resultArr[1]) / 100) * 100;
                            if (recommendCount > 0) {
                                _this.moniVM.buyVM.inputCount(recommendCount);
                            }
                            else {
                                noticeVM.notice('仓位过重，不建议购买！');
                                $('#notice-alert').modal('open');
                            }
                        }).fail(function () {
                            $('#my-modal-loading').modal('close');
                            //console.log('fail');
                        });
                    }
                });

            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function () {
            },
            showNoSuggestionNotice: true,
            noSuggestionNotice: '没有匹配的结果'
        });
        $('#autocomplete-ajax-sale').autocomplete({
            minChars: 1,
            serviceUrl: '/ihanzhendata/stock/matchStocks',
            onSelect: function (suggestion) {
                _this.moniVM.saleVM.inputPrice(0);
                _this.moniVM.saleVM.message('');
                _this.moniVM.saleVM.stockLabel(suggestion.value + "  " + suggestion.data);
                _this.moniVM.saleVM.stockCode(suggestion.value);
                _this.moniVM.saleVM.stockName(suggestion.data);
                //获取建议手数
                $('#my-modal-loading').modal('open');
                $.when(_this.querySorder()).done(function (data) {
                    $('#my-modal-loading').modal('close');
                    var stockArr = data.data;
                    for (var i = 0; i < stockArr.length; i++) {
                        if (stockArr[i].stock_code == _this.moniVM.saleVM.stockCode()) {
                            _this.moniVM.saleVM.inputCount(stockArr[i].sorder_avaliable_amount);
                        }
                    }
                });
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x-sale').val(hint);
            },
            onInvalidateSelection: function () {
            },
            showNoSuggestionNotice: true,
            noSuggestionNotice: '没有匹配的结果'
        });
    };
    _this.processCancelListData = function (cancelArr) {
        //处理从后台获取的撤单Tab页面的列表数据
        if (cancelArr && cancelArr.length > 0) {
            for (var k = 0; k < cancelArr.length; k++) {
                var statusText = '', dealType = '', averagePrice, dealCount;
                switch (cancelArr[k].sorder_status) {
                    case '10': dealType = '买入'; statusText = '未成交'; averagePrice = 0; dealCount = 0; break;
                    case '11': dealType = '买入'; statusText = '撤单'; averagePrice = 0; dealCount = 0; break;
                    case '12': dealType = '买入'; statusText = '部分成交'; averagePrice = cancelArr[k].price; dealCount = cancelArr[k].amount; break;
                    case '13': dealType = '买入'; statusText = '部成部撤'; averagePrice = cancelArr[k].price; dealCount = cancelArr[k].amount; break;
                    case '14': dealType = '买入'; statusText = '全部成功'; averagePrice = cancelArr[k].price; dealCount = cancelArr[k].amount; break;
                    case '20': dealType = '卖出'; statusText = '未成交'; averagePrice = 0; dealCount = 0; break;
                    case '21': dealType = '卖出'; statusText = '撤单'; averagePrice = 0; dealCount = 0; break;
                    case '22': dealType = '卖出'; statusText = '部分成交'; averagePrice = cancelArr[k].price; dealCount = cancelArr[k].amount; break;
                    case '23': dealType = '卖出'; statusText = '部成部撤'; averagePrice = cancelArr[k].price; dealCount = cancelArr[k].amount; break;
                    case '24': dealType = '卖出'; statusText = '全部成功'; averagePrice = cancelArr[k].price; dealCount = cancelArr[k].amount; break;
                }
                var sorderId = cancelArr[k].sorder_id,
                    stockCode = cancelArr[k].stock_code,
                    stockName = cancelArr[k].stock_name,
                    delegatePrice = parseFloat(cancelArr[k].entrust_price).toFixed(3),
                    averagePrice = parseFloat(averagePrice).toFixed(3),
                    delegateCount = cancelArr[k].entrust_amount,
                    status = cancelArr[k].sorder_status;
                var tab = $('li.am-active>a')[0].id;
                if (tab == 't3') {
                    var delegateTime = cancelArr[k].sorder_updatetime.substr(11);
                    var item = new CancelList(sorderId, dealType, stockCode, stockName, delegateTime, delegatePrice, averagePrice, delegateCount, dealCount, status, statusText);
                    _this.moniVM.cancelVM.items.push(item);
                } else if (tab == 't5') {
                    var delegateTime = cancelArr[k].sorder_updatetime.substr(5);
                    var item = new CancelList(sorderId, dealType, stockCode, stockName, delegateTime, delegatePrice, averagePrice, delegateCount, dealCount, status, statusText);
                    item.hasMarked(Boolean(Number(cancelArr[k].is_bj)));
                    _this.moniVM.searchVM.items.push(item);
                }
            }
        }
    };
    _this.processBuySaleListData = function (result) {
        if (result && result.length > 0) {
            var parameterArr = [];
            for (var i = 0; i < result.length; i++) {
                parameterArr.push(result[i].stock_code.substring(7, 9).toLowerCase() + result[i].stock_code.substring(0, 6));
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
                    var resultArr = [];//二维数组
                    for (var i = 0; i < parameterArr.length; i++) {
                        resultArr[i] = eval('hq_str_' + parameterArr[i]).split(',');
                    }
                    for (var j = 0; j < resultArr.length; j++) {
                        var scode = result[j].stock_code,
                            sname = result[j].stock_name,
                            svalue = (resultArr[j][3] * result[j].sorder_position_amount).toFixed(3),
                            holdPosition = result[j].sorder_position_amount,
                            absprofit = ((resultArr[j][3] - result[j].average_price) * holdPosition).toFixed(3),
                            relprofit = ((resultArr[j][3] - result[j].average_price) / result[j].average_price * 100).toFixed(3) + '%',
                            availablePosition = result[j].sorder_avaliable_amount,
                            costPrice = parseFloat(result[j].average_price).toFixed(3),
                            currentPrice = resultArr[j][3];
                        switch ($('li.am-active>a')[0].id) {
                            case 't1': _this.moniVM.buyVM.items.push(new DealList(scode, sname, svalue, absprofit, relprofit, holdPosition, availablePosition, costPrice, currentPrice)); break;
                            case 't2': _this.moniVM.saleVM.items.push(new DealList(scode, sname, svalue, absprofit, relprofit, holdPosition, availablePosition, costPrice, currentPrice)); break;
                            case 't4': _this.moniVM.holdVM.items.push(new DealList(scode, sname, svalue, absprofit, relprofit, holdPosition, availablePosition, costPrice, currentPrice)); break;
                        }
                    }
                    $('.loadspan').hide();
                }
            }).error(function () {
                $('.loadspan').hide();
            });
        }
    };
    _this.processUserAssetData = function (asset) {
        _this.moniVM.holdVM.totalAssets(asset.total_asset);
        _this.moniVM.holdVM.totalProfit((asset.total_rofitlv * 100).toFixed(2) + '%');
        _this.moniVM.holdVM.monthTrade(asset.m_tradetimes);
        _this.moniVM.holdVM.monthProfit((asset.m_profit * 100).toFixed(2) + '%');
        _this.moniVM.holdVM.successRatio((asset.success * 100).toFixed(2) + '%');
        _this.moniVM.holdVM.weekProfit((asset.w_profit * 100).toFixed(2) + '%');
        _this.moniVM.holdVM.floatProfit(asset.total_profit);
        _this.moniVM.holdVM.availableAssets(asset.user_asset);
        _this.moniVM.holdVM.marketValue(asset.total_value);
    };
    _this.processDayProfitData = function (profit) {
        var dateArr = [], profitArr = [];
        for (var i = 0; i < profit.length; i++) {
            var arr = profit[i].time.split(/[- : ]/);
            var updateTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]).Format("MM/DD");
            dateArr.unshift(updateTime);
            profitArr.unshift(profit[i].dayprofit);
        }
        option.xAxis[0].data = dateArr;
        option.series[0].data = profitArr;
        myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
    }
    _this.queryUserDayProfit = function (startDate, endDate) {//查询收益
        var ajaxItem = { uid: localStorage.uid };
        if (startDate && endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            startDate = start.Format('YYYY-MM-DD');
            end.setDate(end.getDate() + 1);
            endDate = end.Format('YYYY-MM-DD');
            ajaxItem = {
                uid: localStorage.uid,
                startDate: startDate,
                endDate: endDate
            }
        }
        return $.get('/ihanzhendata/stockOrderMn/queryUserDayProfit', ajaxItem, function (data) { });
    }
    _this.queryBuyAndSell = function (startDate, endDate, pageNumber, pageSize) {//查询和撤单
        if (!startDate && !endDate) {//撤单Tab列表查询，撤单默认查询当日订单,查询当日订单用当日日期作为起始日期，用明天日期作为结束日期
            var now = new Date();
            startDate = now.Format('YYYY-MM-DD');
            var tomorrow = new Date(now.setDate(now.getDate() + 1));
            endDate = tomorrow.Format('YYYY-MM-DD');
        }
        return $.get('/ihanzhendata/stockOrderMn/queryBuyAndSell', { uid: localStorage.uid, startDate: startDate, endDate: endDate, pageNumber: pageNumber, pageSize: pageSize }, function (data) { });
    }
    _this.queryUserAsset = function () {//资产情况
        return $.get('/ihanzhendata/stockOrderMn/queryUserAsset', { uid: localStorage.uid }, function (data) { });
    }
    _this.querySorder = function (pageNumber, pageSize) {//买入卖出List
        var ajaxItem = { uid: localStorage.uid, pageNumber: pageNumber, pageSize: pageSize };
        if (!pageNumber && !pageSize) {
            ajaxItem = { uid: localStorage.uid };
        }
        return $.get('/ihanzhendata/stockOrderMn/querySorder', ajaxItem, function (result) { });
    }
    _this.proposalPredictionAjax = function () {//获取建议仓位
        return $.get('/ihanzhendata/stock/main_position');
    }
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        ko.applyBindings(_this.moniVM, $("#moni-container")[0]);
        ko.applyBindings(_this.priceVM, $('#price-modal')[0]);
        ko.applyBindings(_this.confirmVM, $('#weituo-alert')[0]);
        _this.initStockCode();
        _this.refresh();
        if (queryString && queryString.tab == 'tab5') {
            //从买卖原因标记页面返回到search Tab, url带参数
            $('ul.am-nav-tabs > li').removeClass('am-active');
            $('.am-tabs-bd .am-tab-panel').removeClass('am-active').removeClass('am-in');
            $('#t5').parent().addClass('am-active');
            $('.am-tabs-bd #tab5').addClass('am-active').addClass('am-in');
            _this.moniVM.tabVM.searchClick();
        } else {
            if (queryString && queryString.stockCode) {
                //从个股详情页面跳转过来url带参数的情况
                var stockCode = queryString.stockCode,
                    stockName = queryString.stockName;
                _this.moniVM.buyVM.stockLabel(stockCode + "  " + stockName);
                _this.moniVM.buyVM.stockCode(stockCode);
                _this.moniVM.buyVM.stockName(stockName);
                //to do ...获取建议手数
            }
            //不带参数  正常进入页面
            _this.moniVM.tabVM.buyClick();
        }
    }
    _this.getCancelListData = function () {
        $('.loadspan').show();
        $.when(_this.queryBuyAndSell(undefined, undefined, _this.pageNumber, pageSize)).done(function (cancelData) {
            $('.loadspan').hide();
            if (cancelData.data.length != 0) {
                //处理从后台获取的撤单Tab页面的列表数据
                _this.processCancelListData(cancelData.data);
            } else {
                $(window).unbind('scroll');
                $('.nomore').show();
            }
        }).fail(function () {
            $('.loadspan').hide();
        });
        _this.pageNumber++; //页码自动增加，保证下次调用时为新的一页。
    }
    _this.getDealListData = function () {
        $('.loadspan').show();
        $.when(_this.querySorder(_this.pageNumber, pageSize)).done(function (stockData) {
            //处理买入/卖出/持仓Tab页面的列表数据
            if (stockData.data.length != 0) {
                _this.processBuySaleListData(stockData.data);
            } else {
                $(window).unbind('scroll');
                $('.loadspan').hide();
                $('.nomore').show();
            }
        }).fail(function () {
            $('.loadspan').hide();
        });
        _this.pageNumber++; //页码自动增加，保证下次调用时为新的一页。 
    }
    _this.getSearchListData = function () {
        $('.loadspan').show();
        var now = new Date();
        var tomorrow = new Date(now.setDate(now.getDate() + 1));
        endDate = tomorrow.Format('YYYY-MM-DD');
        $.when(_this.queryBuyAndSell('2016-01-01', endDate, _this.pageNumber, pageSize)).done(function (data) {
            $('.loadspan').hide();
            if (data.data.length != 0) {
                _this.processCancelListData(data.data);
            } else {
                $(window).unbind('scroll');
                $('.nomore').show();
            }
        }).fail(function () {
            $('.loadspan').hide();
            console.log('search fail');
        });
        _this.pageNumber++; //页码自动增加，保证下次调用时为新的一页。 
    }
    _this.refresh = function () {//点击右上角刷新当前Tab页数据
        $("#KEY_FRESH").click(function () {
            var tab = $('li.am-active>a')[0].id;
            switch (tab) {
                case 't1': _this.moniVM.tabVM.buyClick(); break;
                case 't2': _this.moniVM.tabVM.saleClick(); break;
                case 't3': _this.moniVM.tabVM.cancelClick(); break;
                case 't4': _this.moniVM.tabVM.holdClick(); break;
                case 't5': _this.moniVM.tabVM.searchClick(); break;
                case 't6': _this.moniVM.tabVM.profitClick(); break;
            }
        });
    }
    //==============上拉加载核心代码=============  
    var winH = $(window).height(); //页面可视区域高度   
    var scrollHandler = function () {
        var pageH = $(document.body).height();
        var scrollT = $(window).scrollTop(); //滚动条top   
        var aa = (pageH - winH - scrollT) / winH;
        if (aa < 0.02) {//0.02是个参数  
            var tab = $('li.am-active>a')[0].id;
            if (tab == 't1' || tab == 't2' || tab == 't4') {
                _this.getDealListData();
            } else if (tab == 't3') {
                _this.getCancelListData();
            } else if (tab == 't5') {
                _this.getSearchListData();
            }

        }
    }
    //定义鼠标滚动事件  
    $(window).scroll(scrollHandler);
    //==============上拉加载核心代码=============  
}

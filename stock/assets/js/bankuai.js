$(function () {
    var bankuaiManagement = new BankuaiManagement();
    bankuaiManagement.init();
})
var BankuaiManagement = function () {
    var _this = this;
    _this.strongCodeList = [], _this.strongStockList = [], _this.anticipationCodeList = [], _this.anticipationStockList = [];
    _this.init = function () {
        _this.recommendVM = new PlateVM();
        _this.strongVM = new PlateVM();
        _this.anticipationVM = new PlateVM();
        _this.getPlateData();
        ko.applyBindings(_this.recommendVM, $("#recommendPlate")[0]);
        ko.applyBindings(_this.strongVM, $("#strongPlate")[0]);
        ko.applyBindings(_this.anticipationVM, $("#anticipationPlate")[0]);
        //var int = self.setInterval(_this.updatePlateAsync, 5 * 1000);
    }
    function Stock(stockCode, stockName) {
        this.stockCode = ko.observable(stockCode);
        this.stockName = ko.observable(stockName);
        this.isSelfSelect = ko.observable(false);
        this.isRecommend = ko.observable(false);
        this.isValueble = ko.observable(false);
    }
    function Plate(plateCode, plateName, plateType) {
        this.plateCode = plateCode;
        this.plateName = ko.observable(plateName);
        this.stocks = ko.observableArray([]);
        this.plateType = plateType;//'strong' or'anticipation'
        this.detailsClick = function (item) {
            window.location.href = "bankuai_details.html?plateType=" + item.plateType + "&plateCode=" + item.plateCode;
        }
    }
    var PlateVM = function () {
        _vm = this;
        _vm.plates = ko.observableArray([]);
        _vm.recommendMoreClick = function () {
            window.location.href = "bankuai_more.html?plateType=recommend";
        };
        _vm.strongMoreClick = function () {
            window.location.href = "bankuai_more.html?plateType=strong";
        };
        _vm.anticipationMoreClick = function () {
            window.location.href = "bankuai_more.html?plateType=anticipation";
        };

    }
    _this.updatePlateAsync = function () {
        $.when(_this.updateStrongPlateAsync(), _this.updateAnticipationPlateAsync())
            .done(function (strongResult, anticipationResult) {
                $('#my-modal-loading').modal('close');
                var strongData = JSON.parse(strongResult[2].responseText).data;
                var anticipationData = JSON.parse(anticipationResult[2].responseText).data;
                _this.handleData(strongData, _this.strongVM);
                _this.handleData(anticipationData, _this.anticipationVM);
            }).fail(function () {
                $('#my-modal-loading').modal('close');
                console.log('fail');
            });
    }
    _this.updateStrongPlateAsync = function () {
        $('#my-modal-loading').modal('open');
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/0',
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) { }
        });
    }
    _this.updateAnticipationPlateAsync = function () {
        $('#my-modal-loading').modal('open');
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardready/0',
            contentType: "application/javascript",
            dataType: "jsonp",
            jsonpcallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) { }
        });
    }

    var getRecommendPlate = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/stock/recommendPlate_Stock');
    }
    var getStockProperty = function (codeArray) {//通过用户名和股票代码 从赵佳那查询股票是否是自选股，是否是价值股，返回数组
        $('#my-modal-loading').modal('open');
        var uid = "";
        var uploadArr = $.map(codeArray, function (item) {
            return {
                uid: uid,
                stock_code: item
            };
        });
        return $.post('/', JSON.stringify(uploadArr));
    };
    function handleRecommendData(data) {
        var length = data.length < 3 ? data.length : 3;
        for (var i = 0; i < length; i++) {
            var platetype = data[i].type == "蓄势版块" ? 'anticipation' : 'strong';
            var plate = new Plate(data[i].plate_id, data[i].plate_name, platetype);
            if (data[i].stocks && data[i].stocks.length > 0) {
                var stockLength = data[i].stocks.length < 3 ? data[i].stocks.length : 3;
                for (var j = 0; j < stockLength; j++) {
                    var apiStock = data[i].stocks[j];
                    var stock = new Stock(apiStock.headstock_code, apiStock.headstock_name);
                    plate.stocks.push(stock);
                    var temp = {
                        uid: localStorage.uid,
                        stock_code: apiStock.headstock_code
                    };
                    stock.isValueble(Boolean(parseInt(apiStock.is_jzg)));
                    stock.isSelfSelect(Boolean(parseInt(apiStock.is_zxg)));
                    stock.isRecommend(Boolean(parseInt(apiStock.is_tjg)));
                }
            }
            _this.recommendVM.plates.push(plate);
        }
    };
    function handleStrongData(data) {
        var length = data.length < 6 ? data.length : 6;
        for (var i = 0; i < length; i++) {
            var plate = new Plate(data[i].windcode, data[i].name, 'strong');
            if (data[i].stockslist && data[i].stockslist.length > 0) {
                var stockLength = data[i].stockslist.length < 3 ? data[i].stockslist.length : 3;
                for (var j = 0; j < stockLength; j++) {
                    var apiStock = data[i].stockslist[j];
                    var stock = new Stock(apiStock.windcode, apiStock.name);
                    plate.stocks.push(stock);
                    var temp = {
                        uid: localStorage.uid,
                        stock_code: apiStock.windcode
                    };
                    stock.isRecommend(true);
                    _this.strongCodeList.push(temp);
                }
            }
            _this.strongVM.plates.push(plate);
        }
    };
    function handleAnticipationData(data) {
        var length = data.length < 3 ? data.length : 3;
        for (var i = 0; i < length; i++) {
            var plate = new Plate(data[i].windcode, data[i].name, 'anticipation');
            if (data[i].stockslist && data[i].stockslist.length > 0) {
                var stockLength = data[i].stockslist.length < 3 ? data[i].stockslist.length : 3;
                for (var j = 0; j < stockLength; j++) {
                    var apiStock = data[i].stockslist[j];
                    var stock = new Stock(apiStock.windcode, apiStock.name);
                    plate.stocks.push(stock);
                    var temp = {
                        uid: localStorage.uid,
                        stock_code: apiStock.windcode
                    };
                    stock.isRecommend(true);
                    _this.anticipationCodeList.push(temp);
                }
            }
            _this.anticipationVM.plates.push(plate);
        }
    }
    var handlePropertyData = function (vm) {
        for (var i = 0; i < vm.plates().length; i++) {
            var stocks = vm.plates()[i].stocks();
            for (var j = 0; j < stocks.length; j++) {
                for (var k = 0; k < _this.strongStockList.length; k++) {
                    if (stocks[j].stockCode == _this.strongStockList[k].stock_code) {
                        stocks[j].isSelfSelect(_this.strongStockList[k].is_zxg);
                        stocks[j].isisValueble(_this.strongStockList[k].is_jzg);
                    }
                }
            }
        }
    }
    _this.getPlateData = function () {
        $('#my-modal-loading').modal('open');
        $.when(getRecommendPlate(), _this.updateStrongPlateAsync(), _this.updateAnticipationPlateAsync())
            .done(function (recommendResult, strongResult, anticipationResult) {
                var recommendData = JSON.parse(recommendResult[2].responseText).data;
                var strongData = strongResult[0].data;
                var anticipationData = anticipationResult[0].data;
                handleRecommendData(recommendData);
                handleStrongData(strongData);
                handleAnticipationData(anticipationData);
                $.when(getStockProperty(_this.strongCodeList)).done(function (result) {
                    _this.strongStockList = result;
                });
                //还没有加上蓄势板块的
                _this.anticipationStockList = getStockProperty(_this.anticipationCodeList);
            }).done(function () {
                handlePropertyData(_this.strongVM);
                handlePropertyData(_this.anticipationVM);
            }).done(function () {
                $('#my-modal-loading').modal('close');
            }).fail(function () {
                $('#my-modal-loading').modal('close');
                // fake data 当没有数据现实的时候为了让用户了解页面大概功能
                var data = [{
                    id: 0,
                    windcode: 0,
                    name: '--板块',
                    type: "",
                    EV: 0,
                    pct_chg: 0,
                    stockslist: [{
                        id: 0,
                        windcode: 0,
                        name: "--股票",
                    }, {
                        id: 1,
                        windcode: 0,
                        name: "--股票",
                    }, {
                        id: 2,
                        windcode: 0,
                        name: "--股票",
                    }]
                }];
                for (var i = 0; i < data.length; i++) {
                    //strong plate
                    var plate = new Plate(data[i].windcode, data[i].name, 'strong');
                    var stockLength = data[i].stockslist.length < 3 ? data[i].stockslist.length : 3;
                    for (var j = 0; j < stockLength; j++) {
                        var apiStock = data[i].stockslist[j];
                        var stock = new Stock(apiStock.windcode, apiStock.name);
                        plate.stocks.push(stock);
                        var temp = {
                            uid: localStorage.uid,
                            stock_code: apiStock.windcode
                        };
                        stock.isRecommend(true);
                    }
                    _this.strongVM.plates.push(plate);
                    //recommend plate
                    var plate = new Plate(data[i].windcode, data[i].name, 'recommend');
                    var stockLength = data[i].stockslist.length < 3 ? data[i].stockslist.length : 3;
                    for (var j = 0; j < stockLength; j++) {
                        var apiStock = data[i].stockslist[j];
                        var stock = new Stock(apiStock.windcode, apiStock.name);
                        plate.stocks.push(stock);
                        var temp = {
                            uid: localStorage.uid,
                            stock_code: apiStock.windcode
                        };
                        stock.isRecommend(true);
                    }
                    _this.recommendVM.plates.push(plate);

                    var plate = new Plate(data[i].windcode, data[i].name, 'anticipation');
                    var stockLength = data[i].stockslist.length < 3 ? data[i].stockslist.length : 3;
                    for (var j = 0; j < stockLength; j++) {
                        var apiStock = data[i].stockslist[j];
                        var stock = new Stock(apiStock.windcode, apiStock.name);
                        plate.stocks.push(stock);
                        var temp = {
                            uid: localStorage.uid,
                            stock_code: apiStock.windcode
                        };
                        stock.isRecommend(true);
                    }
                    _this.anticipationVM.plates.push(plate);
                }
                console.log('fail');
            });

    }
}



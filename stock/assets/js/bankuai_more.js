$(function () {
    var bankuaiMoreManagement = new BankuaiMoreManagement();
    bankuaiMoreManagement.init();
})
var BankuaiMoreManagement = function () {
    var _this = this;
    var PlateVM = function () {
        _vm = this;
        _vm.titlePlate = ko.observable('');
        _vm.plateCount = ko.observable(0);
        _vm.items = ko.observableArray([]);

    };
    var plateType = "";
    _this.init = function () {
        _this.plateVM = new PlateVM();
        var queryString = $.request(location.href).queryString;
        plateType = queryString.plateType;
        ko.applyBindings(_this.plateVM, $('body')[0]);
        _this.getPageData(plateType);
        //var int = self.setInterval(_this.updatePlateAsync, 5 * 1000);
    }
    function Plate(plateCode, plateName, plateChange, plateValue, code, name) {
        this.plateCode = ko.observable(plateCode);
        this.plateName = ko.observable(plateName);
        //this.note = ko.observable('');
        this.plateChange = ko.observable(plateChange);
        this.plateValue = ko.observable(plateValue);
        this.headStockCode = ko.observable(code);
        this.headStockName = ko.observable(name);
        //this.type = ko.observable(type);
        this.detailsClick = function (item) {
            window.location.href = "bankuai_details.html?plateCode=" + item.plateCode() + '&plateType=' + plateType;//to do
        }
    };
    _this.getRecommendPlateData = function () {
        _this.plateVM.titlePlate('推荐版块');
        $.get('/ihanzhendata/stock/recommendPlate_Stock', function (result) {
            window.stock.loading(false);
            if (result && result.data) {
                var data = result.data;
                for (var i = 0; i < length; i++) {
                    var plate = new Plate(data[i].plate_id, data[i].plate_name);
                    plate.headStockCode(data[i].headstock_code);
                    plate.headStockName(data[i].headstock_name);
                    _this.recommendVM.plates.push(plate);
                }
            }
        });
    };
    _this.getStrongPlateData = function () {
        _this.plateVM.titlePlate('强势版块');
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/0',
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                window.stock.loading(false);
                if (data && data.data) {
                    var plateArray = data.data;
                    _this.plateVM.plateCount(plateArray.length);
                    for (var i = 0; i < plateArray.length; i++) {
                        var stocklist = plateArray[i].stockslist;
                        if (stocklist && stocklist.length > 0) {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name, plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', stocklist[0].windcode, stocklist[0].name));
                        } else {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name,  plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', '', ''));
                        }
                    }
                }
            }
        });
    };
    _this.getAnticipationPlateData = function () {
        _this.plateVM.titlePlate('蓄势版块');
         $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardready/0',
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                window.stock.loading(false);
                if (data && data.data) {
                    var plateArray = data.data;
                    _this.plateVM.plateCount(plateArray.length);
                    for (var i = 0; i < plateArray.length; i++) {
                        var stocklist = plateArray[i].stockslist;
                        if (stocklist && stocklist.length > 0) {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name,  plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', stocklist[0].windcode, stocklist[0].name));
                        } else {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name, plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', '', ''));
                        }
                    }
                }
            }
        });
    };
    _this.getPageData = function (plateType) {
        window.stock.loading(true);
        switch (plateType) {
            case 'recommend': _this.getRecommendPlateData(); break;
            case 'strong': _this.getStrongPlateData(); break;
            case 'anticipation': _this.getAnticipationPlateData(); break;
        }
    }
}



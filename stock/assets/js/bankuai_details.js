$(function () {
    //var store = $.AMUI.store;
    //if (!store.enabled) {
    //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
    //    return;
    //}
    //var token = localStorage.token, uid = localStorage.uid;
    //if (!token || !uid) {
    //    window.location.href = "login.html";
    //}
    //$('#my-modal-loading').modal('open');
    //$.post('/',
    //  { token: token, uid: uid },
    //  function (data, textStatus) {
    //      $('#my-modal-loading').modal('close');
    //      if (textStatus == "success") {
    //        
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });
    var bankuaiDetailManagement = new BankuaiDetailManagement();
    bankuaiDetailManagement.init();
})
var BankuaiDetailManagement = function () {
    var _this = this;
    _this.init = function () {
        //_this.plateCode = '';
        //_this.plateType = '';
        var queryString = $.request(location.href).queryString;
        _this.plateCode = queryString.plateCode;
        _this.plateType = queryString.plateType;
        _this.stockList = [];
        _this.codeList = [];
        _this.plateVM = new PlateVM();
        _this.getPageData();
        ko.applyBindings(_this.plateVM);//没有明确绑定某个元素 
        //var int = self.setInterval(_this.updatePlateAsync, 5 * 1000);
    }
    function Stock(stockCode, stockName) {
        this.stockCode = ko.observable(stockCode);
        this.stockName = ko.observable(stockName);
        this.isSelfSelect = ko.observable(false);
        this.isRecommend = ko.observable(false);
        this.isValueble = ko.observable(false);
        this.guzhi = ko.observable('');//预留待议
        this.selectClick = function (item) {
            console.log(item.stockCode);
        }
    }
    //function Plate(plateCode, plateName) {
    //    this.plateCode = ko.observable(plateCode);
    //    this.plateName = ko.observable(plateName);
    //}
    function News() {
        this.isUp = ko.observable(true);//fake data
        this.newsTitle = ko.observable('三季度十大预增王 预增546倍夺冠');//fake data
    }
    var PlateVM = function () {
        _vm = this;
        _vm.plateName = ko.observable('');
        _vm.stocks = ko.observableArray([]);
        _vm.newsItems = ko.observableArray([]);//fake data
    }
    //_this.updatePlateAsync = function () {
    //    $.when(_this.updateStrongPlateAsync(), _this.updateAnticipationPlateAsync()).done(function (strongData, anticipationData) {
    //        _this.handleData(strongData, _this.strongVM);
    //        _this.handleData(anticipationData, _this.anticipationVM);
    //    }).fail(function () {
    //        console.log('fail');
    //    });
    //}
    _this.getPlateData = function (palteType) {
        switch (palteType) {
            case 'recommend': break;
            case 'strong':
                $('#my-modal-loading').modal('open');
                return $.ajax({
                    url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/',
                    dataType: "jsonp",
                    jsonpCallback: "jsonpcallback",
                    timeout: 5000,
                    type: "GET",
                    success: function (data) { }
                }); break;
            case 'anticipation': break;
        }

    }
    _this.getPageData = function () {
        $('#my-modal-loading').modal('open');
        $.when(_this.getPlateData(_this.plateType))
            .done(function (data) {
                var strongData = data.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].windcode == _this.plateCode) {
                        _this.plateVM.plateName(data[i].name);
                        var stocks = data[i].stockslist;
                        for (var j = 0; j < stocks.length; j++) {
                            _this.plateVM.stocks.push(new Stock(stocks[j].windcode, stocks[j].name));
                            _this.plateVM.stocks()[j].isRecommend(true);
                            var temp = {
                                uid: "",
                                stock_code: stocks[j].windcode
                            };
                            _this.codeList.push(temp);
                        }
                    }
                }
                $.when(getStockProperty(_this.codeList)).done(function (result) {
                    _this.stockList = result;
                });
            }).done(function () {
                for (var i = 0; i < _this.plateVM.stocks().length; i++) {
                    for (var j = 0; j < _this.stockList.length; j++) {
                        if (_this.plateVM.stocks()[i].stockCode == _this.stockList[j].headstock_code) {
                            _this.plateVM.stocks()[i].isSelfSelect(_this.stockList[j].is_zxg);
                            _this.plateVM.stock()[i].isValueble(_this.stockList[j].is_jzg);
                            _this.plateVM.stock()[i].guzhi(_this.stockList[j].value);
                        }
                    }
                }
            }).done(function () {
                $('#my-modal-loading').modal('close');
            }).fail(function () {
                console.log('fail');
            });

    };
    function getStockProperty(arr) {
        $('#my-modal-loading').modal('open');
        return $.post('/', JSON.stringify(arr));
    }
}



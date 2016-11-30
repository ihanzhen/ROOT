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
    var bankuaiMoreManagement = new BankuaiMoreManagement();
    bankuaiMoreManagement.init();
})
var BankuaiMoreManagement = function () {
    var _this = this;
    _this.init = function () {
        _this.plateVM = new PlateVM();
        var queryString = $.request(location.href).queryString;
        var plateType = queryString.plateType;
        _this.getPageData(plateType);
        ko.applyBindings(_this.plateVM,$('body')[0]);
        //var int = self.setInterval(_this.updatePlateAsync, 5 * 1000);

    }
    function Plate(plateCode, plateName, plateChange, plateValue, code, name) {
        this.plateCode = ko.observable(plateCode);
        this.plateName = ko.observable(plateName);
        this.note = ko.observable('');
        this.plateChange = ko.observable(plateChange);
        this.plateValue = ko.observable(plateValue);
        this.headStockCode = ko.observable(code);
        this.headStockName = ko.observable(name);
        this.detailsClick = function (item) {
            window.location.href = "bankuai_details.html?plateCode=" + item.plateCode();//to do
        }
    };
    var PlateVM = function () {
        _vm = this;
        _vm.titlePlate = ko.observable('');
        _vm.plateCount = ko.observable(0);
        _vm.items = ko.observableArray([]);

    };

    _this.getRecommendPlateData = function () {
        _this.plateVM.titlePlate('推荐版块');
        $.get('/ihanzhendata/stock/recommendPlate_Stock', function (result) {
            var data = result.data;
            for (var i = 0; i < length; i++) {
                var plate = new Plate(data[i].plate_id, data[i].plate_name);
                plate.headStockCode(data[i].headstock_code);
                plate.headStockName(data[i].headstock_name);
                _this.recommendVM.plates.push(plate);
            }
        });
    };

    _this.getStrongPlateData = function () {
        _this.plateVM.titlePlate('强势版块');
        return $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/',
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                var plateArray = data.data;
                _this.plateVM.plateCount(plateArray.length);
                for (var i = 0; i < plateArray.length; i++) {
                    var stocklist = plateArray[i].stockslist;
                    _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name, plateArray[i].pct_chg, plateArray[i].EV, stocklist[0].windcode, stocklist[0].name));
                }
            }
        });
    };
    _this.getAnticipationPlateData = function () {
        _this.plateVM.titlePlate('蓄势版块');
        $.get('/', function (result) {

        });
    };
    _this.getPageData = function (plateType) {
        $('#my-modal-loading').modal('open');
        switch (plateType) {
            case 'recommend': _this.getRecommendPlateData(); break;
            case 'strong': _this.getStrongPlateData(); break;
            //case 'anticipation': _this.getAnticipationPlateData(); break;
        }
    }
}



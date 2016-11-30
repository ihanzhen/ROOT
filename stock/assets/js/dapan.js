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
    var dapanManagement = new DapanManagement();
    dapanManagement.init();
})
var DapanManagement = function () {
    var _this = this;
    _this.init = function () {
        _this.dapanVM = new DapanVM();
        _this.getPageData();
        ko.applyBindings(_this.dapanVM, $("#dapan-container")[0]);
        var int=self.setInterval(_this.updatePriceAsync, Math.ceil(Math.random() * 5) * 1000);
        
    }
    //view model
    var Market = function (price, name, property, position, url, oldPrice) {
        this.price = ko.observable(price);
        this.marketName = ko.observable(name);
        this.property = ko.observable(property);
        this.position = ko.observable(position);
        this.url = ko.observable(url);
        this.oldPrice = ko.observable(oldPrice);
    }
    var DapanVM = function () {
        _vm = this;
        _vm.items = ko.observableArray([]);
        _vm.proposalPredictionsVM = {
            position: ko.observable(''),
            prediction: ko.observable('')
        };
    }
    _this.dapanAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/stock/market_forecast');
    }
    _this.proposalPredictionAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/stock/main_position');
    }
    _this.getPrice = function (datastr, nth) {
        return parseFloat(datastr.split(',')[nth]).toFixed(2);
    }
    _this.updatePriceAsync = function () {
        var index = Math.floor(Math.random() * 3);
        var url = '', datastr;
        switch (index) {
            case 0: url = "http://hq.sinajs.cn/list=sh000001"; datastr = hq_str_sh000001; break;
            case 1: url = "http://hq.sinajs.cn/list=sz399905"; datastr = hq_str_sz399905; break;
            case 2: url = "http://hq.sinajs.cn/list=sz399006"; datastr = hq_str_sz399006; break;
        }
        $.ajax({
            cache: true,
            url: url,
            type: 'GET',
            dataType: 'script',
            timeout: 2000,
            success: function (data, textStatus, jqXHR) {
                var arr = [];
                arr.push(_this.getPrice(datastr, 3));
                arr.push(_this.getPrice(datastr, 1));
                if (arr[0] != _this.dapanVM.items()[index].price()) {
                $($('.zhishuNum')[index]).css('background-color', '#444');
                setTimeout(function () {
                    $($('.zhishuNum')[index]).css('background-color', '#3d3d3d');
                }, 500);
                _this.dapanVM.items()[index].price(arr[0]);
                _this.dapanVM.items()[index].oldPrice(arr[1]);
                }
            }
        });
    }
   
    _this.getPageData = function () {
        $('#my-modal-loading').modal('open');
        var closePrice = [];
        var openPrice = [];
        closePrice.push(_this.getPrice(hq_str_sh000001, 3));
        closePrice.push(_this.getPrice(hq_str_sz399905, 3));
        closePrice.push(_this.getPrice(hq_str_sz399006, 3));
        openPrice.push(_this.getPrice(hq_str_sh000001, 1));
        openPrice.push(_this.getPrice(hq_str_sz399905, 1));
        openPrice.push(_this.getPrice(hq_str_sz399006, 1));
        $.when(_this.dapanAjax(), _this.proposalPredictionAjax())
            .done(function (dapanResult, proposalResult) {
                $('#my-modal-loading').modal('close');
                var dapanData = JSON.parse(dapanResult[2].responseText).data;
                for (var i = 0; i < dapanData.length; i++) {
                    _this.dapanVM.items.push(new Market(closePrice[i], dapanData[i].market_name,
                        dapanData[i].property, dapanData[i].position / 10 + '成仓', dapanData[i].tendency_url, openPrice[i]));
                }
                var proposalData = JSON.parse(proposalResult[2].responseText).data;
                _this.dapanVM.proposalPredictionsVM.position(proposalData.main_position + '%');
                _this.dapanVM.proposalPredictionsVM.prediction(proposalData.main_tendency);
            }).fail(function () {
                console.log('fail');
            });
    }
}



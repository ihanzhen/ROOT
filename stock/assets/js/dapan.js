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

    var dapanVM = new DapanVM();
    getPageData(dapanVM);
    ko.applyBindings(dapanVM, $("#dapan-container")[0]);
   
})
//view model
function Market(price, name, property, position, url, oldPrice) {
    this.price = ko.observable(price);
    this.marketName = ko.observable(name);
    this.property = ko.observable(property);
    this.position = ko.observable(position);
    this.url = ko.observable(url);
    this.oldPrice = oldPrice;
}
function DapanVM() {
    _vm = this;
    _vm.items = ko.observableArray([]);
    _vm.proposalPredictionsVM = {
        position: ko.observable(''),
        prediction: ko.observable('')
    };
}
var dapanAjax = function () {
    $('#my-modal-loading').modal('open');
    return $.get('/ihanzhendata/stock/market_forecast');
}
var proposalPredictionAjax = function () {
    $('#my-modal-loading').modal('open');
    return $.get('/ihanzhendata/stock/main_position');
}
var getPageData = function (vm) {
    $('#my-modal-loading').modal('open');
    $.when(dapanAjax(), proposalPredictionAjax())
        .done(function (dapanResult, proposalResult) {
            $('#my-modal-loading').modal('close');
            var dapanData = JSON.parse(dapanResult[2].responseText).data;
            for (var i = 0; i < dapanData.length; i++) {
                vm.items.push(new Market(dapanData[i].close_price, dapanData[i].market_name, dapanData[i].property, dapanData[i].position / 10 + '成仓', dapanData[i].tendency_url, dapanData[i].old_close_price));
            }
            var proposalData = JSON.parse(proposalResult[2].responseText).data;
            vm.proposalPredictionsVM.position(proposalData.main_position + '%');
            vm.proposalPredictionsVM.prediction(proposalData.main_tendency);
        }).fail(function () {
            console.log('fail');
        });
}






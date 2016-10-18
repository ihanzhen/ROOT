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
    $('#my-modal-loading').modal('open');
    $.get('/ihanzhendata/stock/market_forecast', function (result) {
        $('#my-modal-loading').modal('close');
        var data = result.data;
        for (var i = 0; i < data.length; i++) {
            dapanVM.items().push(new Market(data[i].close_price,data[i].market_name,data[i].property,data[i].position,data[i].tendency_price,data[i].old_close_price));
        }
    });

    ////fake data
    //result = {
    //    "status": 1,
    //    "msg": "查询成功",
    //    "data": [
    //      {
    //          "uid": null,
    //          "market_name": "上证指数",
    //          "position": 50,
    //          "tendency_url": null,
    //          "property": "中期看涨",
    //          "close_price": 1234.23,
    //          "old_close_price": 1111.34
    //      },
    //      {
    //          "uid": null,
    //          "market_name": "中证500",
    //          "position": 30,
    //          "tendency_url": null,
    //          "property": "短期看涨",
    //          "close_price": 1112.25,
    //          "old_close_price": 1111.45
    //      },
    //      {
    //          "uid": null,
    //          "market_name": "创业板指",
    //          "position": 20,
    //          "tendency_url": null,
    //          "property": "长期看涨",
    //          "close_price": 1356.36,
    //          "old_close_price": 1567.45
    //      }
    //    ]
    //};
    //var data = result.data;
    //for (var i = 0; i < data.length; i++) {
    //    dapanVM.items().push(new Market(data[i].close_price, data[i].market_name, data[i].property, data[i].position / 10 + '成仓', data[i].tendency_price, data[i].old_close_price));
    //}
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
}





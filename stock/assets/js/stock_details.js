$(function () {
    var stockDetailsPage = new StockDetailsPage();
    stockDetailsPage.init();
})
var StockDetailsPage = function () {
    var _this = this;
    _this.stockVM = {};
    _this.confirmVM = {
        select: ko.observable('zx1'),
        cancelClick: function () { },
        confirmClick: function () {

        }
    }
    //function StockVM() {
    //    this.flashClick = function () {
    //        window.location.href = "moni.html" + "?stockCode=601991";
    //    }
    //}

    _this.init = function () {
        ko.applyBindings(_this.stockVM, $('#stock-details')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        $("#addSelfSelect").click(function () {
            $('#confirm-alert').modal('open');
        });
    }
}



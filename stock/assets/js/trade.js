$(function () {
    var tradeManagement = new TradeManagement();
    tradeManagement.init();
})
function TradeManagement() {
    var _this = this;
    _this.tradeVM = new TradeVM();
    function TradeVM() {
        var _vm = this;
        _vm.tab = {
            firstRemark: ko.observable(''),
            secondRemark: ko.observable(''),
            thirdRemark: ko.observable('')
        };
        _vm.firstStocks = ko.observableArray([]);
        _vm.secondStocks = ko.observableArray([]);
        _vm.thirdStocks = ko.observableArray([]);
    }
    function Stock(scode, sname, price, priceChange, valuation, isSelect, isRecommend, isValuable, trend) {
        this.scode = ko.observable(scode);
        this.sname = ko.observable(sname);
        this.price = ko.observable(price);
        this.priceChange = ko.observable(priceChange);
        this.valuation = ko.observable(valuation);
        this.isSelect = ko.observable(isSelect);
        this.isRecommend = ko.observable(isRecommend);
        this.isValuable = ko.observable(isValuable);
        this.trend = ko.observable(trend);
        this.detailsClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode();
        }
    };
    _this.init = function () {
        _this.tradeVM.firstStocks.push(new Stock('000656.SH', '金科股份', 3058.51, +26.12, 'A+', true, true, true, '看空'));
        _this.tradeVM.secondStocks.push(new Stock('000656.SH', '金科股份', 3058.51, +26.12, 'A+', true, true, true, '看空'));
        _this.tradeVM.thirdStocks.push(new Stock('000656.SH', '金科股份', 3058.51, +26.12, 'A+', true, true, true, '看空'));
        ko.applyBindings(_this.tradeVM, $('#trade-container')[0]);
    };
}
$(function () {
    var homeManagement = new HomeManagement();
    homeManagement.init();
})
//view model
function HomeManagement() {
    var _this = this;
    function HomeVm() {
        _vm = this;
        _vm.proposalPredictionsVM = {
            position: ko.observable(''),
            prediction: ko.observable('')
        };
    }
    _this.init = function () {
        var homeVM = new HomeVm();
        _this.getPageData(homeVM);
        ko.applyBindings(homeVM, $("#home-container")[0]);
        //setTimeout(function () {

        //}, Math.ceil(Math.random() * 5));
    }
    _this.proposalPredictionAjax = function () {
        $('#my-modal-loading').modal('open');
        return $.get('/ihanzhendata/stock/main_position');
    }
    _this.getPageData = function (vm) {
        $.when(_this.proposalPredictionAjax()).done(function (proposalResult) {
            //var proposalData = JSON.parse(proposalResult[2].responseText).data;
            $('#my-modal-loading').modal('close');
            var proposalData = proposalResult.data;
            vm.proposalPredictionsVM.position(proposalData.main_position + '%');
            vm.proposalPredictionsVM.prediction(proposalData.main_tendency);
        }).fail(function () {
            console.log('fail');
        });
    }

}


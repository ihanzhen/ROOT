$(function () {
    var homeManagement = new HomeManagement();
    homeManagement.init();
})
function HomeManagement() {
    var _this = this;
    _this.homeVM = new HomeVm();
    function HomeVm() {
        _vm = this;
        _vm.proposalPredictionsVM = {
            position: ko.observable(''),
            prediction : ko.observable('')
        }
        _vm.iconVM = {
            dapanClick: function () {
                window.location.href = "dapan.html";
            },
            bankuaiClick: function () {
                window.location.href = "bankuai.html";
            },
            recommendStocksClick: function () {
                window.location.href = "tuijian_jishu.html";
            },
            backtestingClick: function () {
                //window.location.href = "dapan.html";
            },
            assetsManagementClick: function () {
                //window.location.href = "dapan.html";
            },
            selectedStocksClick: function () {
                window.location.href = "tuijian_jiben.html";
            },
            globalPredictClick: function () {
                window.location.href = "globle_markets.html";
            },
            captialCurveClick: function () {
                //window.location.href = "dapan.html";
            },
            customStocksClick: function () {
                window.location.href = "tuijian_shijian.html";
            }
        }
    }
   
    _this.init = function () {
        ko.applyBindings(_this.homeVM, $("#home-container")[0]);
        _this.getPageData(_this.homeVM);
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
            $('#my-modal-loading').modal('close');
            console.log('fail');
        });
    }

}


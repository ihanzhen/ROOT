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
            prediction: ko.observable(''),
            updataTime:ko.observable('')
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
            var arr = proposalData.updatetime.split(/[- : ]/);
            var updateTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
            var nowTime = new Date();
            var past = parseInt(nowTime.getTime()) - parseInt(updateTime.getTime());
            if (past / 1000 / 60 < 60) {
                vm.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60).toString()+"分钟");
            } else if (past / 1000 / 60 / 60 < 24) {
                vm.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60).toString() + "小时");
            } else if (past / 1000 / 60 / 60 / 24 < 30) {
                vm.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60 / 24).toString() + "天");
            } else  if(past / 1000 / 60 / 60 / 24 / 30<12) {
                vm.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60 / 24 / 30).toString() + "月");
            } else {
                vm.proposalPredictionsVM.updataTime(Math.floor(past / 1000 / 60 / 60 / 24 / 30 / 12).toString() + "年");
            }
        }).fail(function () {
            $('#my-modal-loading').modal('close');
            console.log('fail');
        });
    }

}


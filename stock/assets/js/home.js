$(function () {
    'use strict';

    var store = $.AMUI.store;
    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return;
    }
    var token = localStorage.token, uid = localStorage.uid;
    if (!token || !uid) {
        window.location.href = "login.html";
    }
    $('#my-modal-loading').modal('open');
    $.get('/ihanzhendata/user/jurisdiction',
      { token: token, uid: uid },
      function (data, textStatus) {
          $('#my-modal-loading').modal('close');
          if (textStatus == "success") {
              if (data.status == 1) {
                  console.log('鉴权成功');
              }
          } else {
              window.location.href = "login.html";
          }
      }).error(function () {
          console.log('鉴权失败');
          $('#my-modal-loading').modal('close');
      });
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


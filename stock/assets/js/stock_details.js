$(function () {
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
    $.post('/ihanzhendata/user/jurisdiction',
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
          $('#my-modal-loading').modal('close');
          console.log('鉴权失败');
      });
    var stockDetailsPage = new StockDetailsPage();
    stockDetailsPage.init();
})
var StockDetailsPage = function () {
    var _this = this;
    var StockVM =function() {
        this.flashClick=function(){
            window.location.href = "moni.html"+"?stockCode=601991";
        }
    }
    _this.init = function () {
        ko.applyBindings(new StockVM());
    }
}



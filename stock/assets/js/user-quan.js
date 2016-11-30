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
    //           debugger;//change according to api
    //           var tickets=data;//tickets is Array
    //           for(var i=0;i<tickets.length;i++)
    //           {
    //var hasUsed = tickets[i].hasUsed,
    //    content = tickets[i].content,
    //    mdate = tickets[i].mdate;
    //viewModel.items.push(new Ticket(hasUsed,content,mdate));
    //           }
    //           
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });


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
    //$.post('/ihanzhendata/user/jurisdiction',
    //  { token: token, uid: uid },
    //  function (data, textStatus) {
    //      $('#my-modal-loading').modal('close');
    //      if (textStatus == "success") {
    //          if (data.status == 1) {
    //              console.log('鉴权成功');
    //          }
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  }).error(function () {
    //      $('#my-modal-loading').modal('close');
    //      console.log('鉴权失败');
    //  });
    function Ticket(hasUsed, content, mdate) {
        this.hasUsed = ko.observable(hasUsed);
        this.content = ko.observable(content);
        this.mdate = ko.observable(mdate);
    }
    function ViewModel() {
        var self = this;
        self.items = ko.observableArray();
    }
    var viewModel = new ViewModel();
    //fake data
    var tickets = [
       {
           hasUsed: true,
           content: '免费1个月试用券',
           mdate: '01/23'
       },
       {
           hasUsed: false,
           content: '免费6个月试用券',
           mdate: '10/29'
       },
       {
           hasUsed: true,
           content: '免费6个月试用券',
           mdate: '10/23'
       }];
    for (var i = 0; i < tickets.length; i++) {
        var hasUsed = tickets[i].hasUsed,
            content = tickets[i].content,
            mdate = tickets[i].mdate;
        viewModel.items.push(new Ticket(hasUsed, content, mdate));
    }
    ko.applyBindings(viewModel, $("#ticket-container")[0]);
})


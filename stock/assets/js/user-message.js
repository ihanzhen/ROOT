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
    //           var messages=data;//messages is Array
    //           for(var i=0;i<messages.length;i++)
    //           {
    //var hasRead = messages[i].hasRead,
    //    content = messages[i].content,
    //    mdate = messages[i].mdate;
    //viewModel.items.push(new Message(hasRead,content,mdate));
    //           }
    //           
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });
    function Message(hasRead, content, mdate) {
        this.hasRead = ko.observable(hasRead);
        this.content = ko.observable(content);
        this.mdate = ko.observable(mdate);
    }
    function ViewModel() {
        var self = this;
        self.items = ko.observableArray();
    }
    var viewModel = new ViewModel();
    //fake data
    var messages = [
       {
           hasRead: true,
           content: '拉sdfadfada',
           mdate: '01/23'
       },
       {
           hasRead: false,
           content: '拉速度开好快好快好快税',
           mdate: '10/29'
       },
       {
           hasRead: true,
           content: 'dfghjk',
           mdate: '10/23'
       }];
    for (var i = 0; i < messages.length; i++) {
        var hasRead = messages[i].hasRead,
            content = messages[i].content,
            mdate = messages[i].mdate;
        viewModel.items.push(new Message(hasRead, content, mdate));
    }
    ko.applyBindings(viewModel, $("#message-container")[0]);
})


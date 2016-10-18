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
    //          // to do...
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });
    var opinionVM = {
        title: ko.observable(''),
        content: ko.observable(''),
        submitClick: function () {
            var opinionInfo = {
                title: opinionVM.title(),
                content: opinionVM.content()
            }
            $('#my-modal-loading').modal('open');
            $.post('/', opinionInfo,function (data,status) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    console.log('submit success');
                    $('#my-confirm').modal({
                        onConfirm: function () {
                            window.location.href = "user.html";
                        },
                        onCancel: function () {
                            window.location.href = "home.html";
                        }
                    });
                }
                else {
                    console.log('submit fail')
                }
            })
        }
    }
    ko.applyBindings(opinionVM, $("#opinion-container")[0]);
})


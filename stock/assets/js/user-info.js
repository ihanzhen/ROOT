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
    //          userInfoVM.nickName(localStorage.nickName);
    //          userInfoVM.sex(localStorage.sex);
    //          userInfoVM.email(localStorage.email);
    //          userInfoVM.phone(localStorage.phone);
    //          userInfoVM.address(localStorage.address);
    //          userInfoVM.motto(localStorage.motto);
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });
    ko.applyBindings(userInfoVM, $("#userinfo-container")[0]);
})

//view model
var userInfoVM = {
    nickName: ko.observable(''),
    sex: ko.observable(''),
    email: ko.observable(''),
    phone: ko.observable(''),
    region: ko.observable(''),
    motto: ko.observable(''),
    saveClick: function () {
        userInfoVM.region($("#demo2").val());
        var userInfo = {
            nickName: userInfoVM.nickName(),
            sex: userInfoVM.sex(),
            email: userInfoVM.email(),
            phone: userInfoVM.phone(),
            region: userInfoVM.region(),
            motto: userInfoVM.motto()
        }
        //do ajax
        debugger;
    }
}

//region select
var area2 = new LArea();
area2.init({
    'trigger': '#demo2',//触发选择控件的文本框，同时选择完毕后name属性输出到该位置
    'valueTo': '#value2',//选择完毕后id属性输出到该位置
    'keys': {
        id: 'value',
        name: 'text'
    },//绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
    'type': 2,//数据源类型
    'data': [provs_data, citys_data, dists_data]//数据源
});

//upload photo
function uploads(obj) {
    if (obj.value == "") {
        return;
    }
    else if (!obj.value.match(/.jpg|.gif|.png|.bmp|.jpeg/i)) {
        alert("请选择图片文件！");
    } else {
        pushImg(obj);
    }
}
function pushImg(obj) {
    debugger;
    var url = "upload/"; //访问控制器是upload，后面必须加'/'否则会报错"org.apache.catalina.connector.RequestFacade cannot be cast to org.springframework.web.multipart.Mult...",但是如果是多级的URL【例如XX/XXX/00/upload/0】又没问题了.
    var files = $("#fileBtn").get(0).files[0]; //获取file控件中的内容
    if (files.size > 5 * 1024 * 1024) {
        alert("max size is 5M");
        return;
    }
    var fd = new FormData();
    fd.append("errPic", files);
    $('#my-modal-loading').modal('open');
    $.ajax({
        type: "POST",
        contentType: false, //必须false才会避开jQuery对 formdata 的默认处理 , XMLHttpRequest会对 formdata 进行正确的处理
        processData: false, //必须false才会自动加上正确的Content-Type 
        url: url,
        data: fd,
        success: function (msg) {
            $('#my-modal-loading').modal('close');
            debugger;
            var jsonString = JSON.stringify(msg);
            //$("#txtTd").text(jsonString)
            alert(jsonString);
            var fileurl = window.URL.createObjectURL(obj.files[0]);
            $("#portrait").css({ 'background': 'url(' + fileurl + ') no-repeat center', 'background-size': '100% 100%' });
        },
        error: function (msg) {
            $('#my-modal-loading').modal('close');
            debugger;
            alert("error");
        }
    });
}


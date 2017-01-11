$(function () {
    var userInfoPage = new UserInfoPage();
    userInfoPage.init();
})
var UserInfoPage = function () {
    var _this = this;
    _this.init = function () {
        _this.initRegion();
        ko.applyBindings(userInfoVM, $("#userinfo-container")[0]);
        _this.initUserInfo();
    };
    //view model
    var userInfoVM = {
        nickname: ko.observable(''),
        sex: ko.observable(''),
        email: ko.observable(''),
        phone: ko.observable(''),
        region: ko.observable(''),
        motto: ko.observable(''),
        portrait: ko.observable(''),//url('../images/user.jpg')
        canVerify: ko.observable(false),
        saveClick: function () {
            var sex;
            var tempadd = $("#demo2").val().split(',').join(' ');
            userInfoVM.region(tempadd);
            switch (userInfoVM.sex()) {
                case '男': sex = '1'; break;
                case '保密': sex = '0'; break;
                case '女': sex = '2'; break;
            }
            var userInfo = {
                nickName: userInfoVM.nickname(),
                sex: sex,
                email: userInfoVM.email(),
                address: userInfoVM.region(),
                signature: userInfoVM.motto(),
            };
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/user/' + localStorage.uid + '/usercenter', userInfo, function (data) {
                $('#my-modal-loading').modal('close');
                if (data && data.status && data.status == 1) {
                    $('#success-confirm').modal({
                        onConfirm: function (options) {
                            window.location.href = 'user.html';
                        },
                        onCancel: function () {
                            window.location.href = 'home.html';
                        }
                    })
                } else {
                    noticeVM.notice('信息保存失败，请重新保存！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                $('#my-modal-loading').modal('close');
                noticeVM.notice('信息保存失败，请重新保存！');
                $('#notice-alert').modal('open');
            });
        }
    }
    _this.initUserInfo = function () {
        //_this.initInfoByStorage();
        _this.initInfoByAjax();
    }
    _this.initInfoByAjax = function () {
        $('#my-modal-loading').modal('open');
        $.get('/ihanzhendata/user/userinfo/' + localStorage.uid, function (data) {
            $('#my-modal-loading').modal('close');
            if (data.status == 1) {
                var user = data.data;
                userInfoVM.email(user.email);
                userInfoVM.phone(user.loginName);
                userInfoVM.motto(user.signature);
                userInfoVM.region(user.address);
                $("#portrait").css({ 'background': 'url(' + user.headImgUrl + ') no-repeat center', 'background-size': '100% 100%' });
                userInfoVM.nickname(user.nickname);
                switch (user.sex) {
                    case '1': userInfoVM.sex('男'); break;
                    case '2': userInfoVM.sex('女'); break;
                    case '0': userInfoVM.sex('保密'); break;
                };
            }
        }).error(function () {
            $('#my-modal-loading').modal('close');
        });
    }
    //_this.initInfoByStorage = function () {
    //    $("#portrait").css({ 'background': 'url(' + localStorage.headImgUrl + ') no-repeat center', 'background-size': '100% 100%' });
    //    userInfoVM.nickname(localStorage.nickname);
    //    switch (localStorage.sex) {
    //        case '1': userInfoVM.sex('男'); break;
    //        case '2': userInfoVM.sex('女'); break;
    //        case '0': userInfoVM.sex('保密'); break;
    //    };
    //    if (localStorage.address) {
    //        userInfoVM.region(localStorage.address);
    //    }
    //}
    _this.initRegion = function () { //region select
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
    }
}
function uploads(obj) {//upload photo
    if (obj.value == "") {
        return;
    }
    else if (!obj.value.match(/.jpg|.gif|.png|.bmp|.jpeg/i)) {
        noticeVM.notice('请选择图片文件！');
        $('#notice-alert').modal('open');
    } else {
        pushImg(obj);
    }
}
function pushImg(obj) {
    //var url = "upload/"; //访问控制器是upload，后面必须加'/'否则会报错"org.apache.catalina.connector.RequestFacade cannot be cast to org.springframework.web.multipart.Mult...",但是如果是多级的URL【例如XX/XXX/00/upload/0】又没问题了.
    var url = "/ihanzhendata/user/" + localStorage.uid + "/headpicture";
    var files = $("#fileBtn").get(0).files[0]; //获取file控件中的内容
    if (files.size > 5 * 1024 * 1024) {
        noticeVM.notice('图片最大为5M！');
        $('#notice-alert').modal('open');
        return;
    }
    var fd = new FormData();
    fd.append("clientHeadPicture", files);
    $('#my-modal-loading').modal('open');
    $.ajax({
        type: "POST",
        contentType: false, //必须false才会避开jQuery对 formdata 的默认处理 , XMLHttpRequest会对 formdata 进行正确的处理
        processData: false, //必须false才会自动加上正确的Content-Type 
        url: url,
        data: fd,
        success: function (data) {
            if (data.status == 1) {
                $('#my-modal-loading').modal('close');
                $("#portrait").css({ 'background': 'url(' + data.msg + ') no-repeat center', 'background-size': '100% 100%' });
                localStorage.headImgUrl = data.msg;
            }
        },
        error: function (msg) {
            $('#my-modal-loading').modal('close');
            alert("error");
        }
    });
}

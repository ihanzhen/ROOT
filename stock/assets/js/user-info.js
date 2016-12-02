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

    //'use strict';

    //var store = $.AMUI.store;
    //if (!store.enabled) {
    //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
    //    return;
    //}
    //var token = localStorage.token, uid = localStorage.uid;
    ////var token = 'fb984967dd654d179158abe02618458f', uid = '4a0e6c4378f34828b6e8891ff2986b64';
    //if (!token || !uid) {
    //    window.location.href = "login.html";
    //}
    //$('#my-modal-loading').modal('open');
    //$.get('/ihanzhendata/user/jurisdiction',
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
    //      console.log('鉴权失败');
    //      $('#my-modal-loading').modal('close');
    //  });
    var userInfoPage = new UserInfoPage();
    userInfoPage.init();
})
var UserInfoPage = function () {
    var _this = this;
    _this.openId = "";
    _this.accessToken = "";
    _this.headimgurl = "";
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        _this.openId = queryString.openId;
        _this.accessToken = queryString.accessToken;
        _this.wxcheck();
        ko.applyBindings(userInfoVM, $("#userinfo-container")[0]);
    };
    _this.wxcheck = function () {
        $('#my-modal-loading').modal('open');
        $.post('/ihanzhendata/user/wxcheck', {
            openId: _this.openId,
            accessToken: _this.accessToken
        }, function (data) {
            $('#my-modal-loading').modal('close');
            if (data.status == 2001) {
                var user = data.data;
                _this.headimgurl = user.headImgUrl;
                userInfoVM.nickName(user.nickname);
                if (user.sex == 1) {
                    userInfoVM.sex('男');
                } else if (user.sex == 2) {
                    userInfoVM.sex('女');
                }else if(user.sex==0){
                    userInfoVM.sex('保密');
                }
                userInfoVM.portrait('url(' + user.headImgUrl + ') 100% 100%');
            } else if (data.status == 2002) {
                window.location.href = 'home.html';
            }
        }).error(function () {
            $('#my-modal-loading').modal('close');
        });
    }
    //view model
    var userInfoVM = {
        nickName: ko.observable(''),
        sex: ko.observable(''),
        email: ko.observable(''),
        phone: ko.observable(''),
        vcode: ko.observable(''),
        verifyText: ko.observable('发送验证码'),
        region: ko.observable(''),
        motto: ko.observable(''),
        portrait: ko.observable(''),//url('../images/user.jpg')
        canVerify: ko.observable(false),
        verifyClick: function () {
            var phone = this.phone().trim();
            $('#send-confirm').modal({
                onConfirm: function (options) {
                    $.ajax({
                        url: "/ihanzhendata/user/" + phone + "/sendsms",
                        type: "Get",
                        context: null,
                        success: function (data) {

                        }
                    });
                    var wait = 60;
                    (function time(o) {
                        if (wait == 0) {
                            o.canVerify(true);
                            o.verifyText('发送验证码');
                            wait = 60;
                        }
                        else {
                            o.canVerify(false);
                            o.verifyText('重新获取（' + wait.toString() + '）');
                            wait--;
                            setTimeout(function () {
                                time(o);
                            }, 1000);
                        }
                    })(userInfoVM);
                },
                onCancel: function () {
                }
            });
        },
        saveClick: function () {
            var sex;
            userInfoVM.region($("#demo2").val());
            switch(userInfoVM.sex()){
                case '男':sex='1';break;
                case '保密':sex='0';break;
                case '女':sex='2';break;
            }
            var userInfo = {
                openid: _this.openId,
                nickName: userInfoVM.nickName(),
                sex: sex,
                email: userInfoVM.email(),
                vcode: userInfoVM.vcode(),
                address: userInfoVM.region(),
                //motto: userInfoVM.motto(),
                headimgurl: _this.headimgurl,
                passWord:"123456"
            };
            //do ajax
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/user/' + userInfoVM.phone() + '/regist', userInfo, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    localStorage.token = data.data.token;
                    localStorage.uid = data.data.uid;
                    $('#success-confirm').modal({
                        onConfirm: function () {
                            window.location.href = "user.html";
                        },
                        onCancel: function () {
                            window.location.href = "home.html";
                        }
                    });
                }
                
            }).error(function () {
                $('#my-modal-loading').modal('close');
            });
        }
    }
    userInfoVM.phone.subscribe(function (newValue) {
        var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
        if (pRegex.test(newValue.trim())) {
            userInfoVM.canVerify(true);
            $("#verifyBtn").addClass('am-btn-warning');
        }
        else {
            userInfoVM.canVerify(false);
            $("#verifyBtn").removeClass('am-btn-warning');
        }
    });
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
                var jsonString = JSON.stringify(msg);
                //$("#txtTd").text(jsonString)
                alert(jsonString);
                var fileurl = window.URL.createObjectURL(obj.files[0]);
                $("#portrait").css({ 'background': 'url(' + fileurl + ') no-repeat center', 'background-size': '100% 100%' });
            },
            error: function (msg) {
                $('#my-modal-loading').modal('close');
                alert("error");
            }
        });
    }
}

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
    _this.tempCode = '';
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.comfirmVM = {
        bodyText: ko.observable(''),
        cancelText: ko.observable(''),
        confirmText: ko.observable(''),
    };
    _this.init = function () {
        var queryString = $.request(location.href).queryString;
        _this.openId = queryString.openId;
        _this.accessToken = queryString.accessToken;
        _this.wxcheck();
        ko.applyBindings(userInfoVM, $("#userinfo-container")[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        ko.applyBindings(_this.comfirmVM, $('#success-confirm')[0]);
        userInfoVM.createCodeClick();
    };
    _this.wxcheck = function () {
        $('#my-modal-loading').modal('open');
        $.post('/ihanzhendata/user/wxcheck', {
            openId: _this.openId,
            accessToken: _this.accessToken
        }, function (data) {
            $('#my-modal-loading').modal('close');
            if (data.status == 2001) {
                _this.comfirmVM.bodyText(' 请到会员中心填写您个人资料，完成会员注册');
                _this.comfirmVM.cancelText('返回首页');
                _this.confirmVM.confirmText('下一步');
                $('#success-confirm').modal({
                    onConfirm: function (options) {
                     
                    },
                    onCancel: function () {
                        window.location.href = 'home.html';
                    }
                })
                var user = data.data;
                _this.headimgurl = user.headImgUrl;
                userInfoVM.nickName(user.nickname);
                if (user.sex == 1) {
                    userInfoVM.sex('男');
                } else if (user.sex == 2) {
                    userInfoVM.sex('女');
                } else if (user.sex == 0) {
                    userInfoVM.sex('保密');
                }
                userInfoVM.portrait('url(' + user.headImgUrl + ') 100% 100%');
            } else if (data.status == 2002) {
                window.location.href = 'user.html';
            } else if (data.stutus == 2000) {
                window.location.href = 'wechat_follow.html';
                //_this.noticeVM.notice('请用微信关注 函真投资/函真数据，及时消息不错过！');
                //$('#notice-alert').modal('open');
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
        showCode: ko.observable(''),
        canInputPhone: ko.observable(false),
        inputPhotoCode: ko.observable(''),
        portrait: ko.observable(''),//url('../images/user.jpg')
        canVerify: ko.observable(false),
        createCodeClick: function () {
            var codeLength = 6; //验证码的长度
            var checkCode = $("#checkCode")[0];
            _this.tempCode = '';
            var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
            for (var i = 0; i < codeLength; i++) {
                var charNum = Math.floor(Math.random() * 52);
                _this.tempCode += codeChars[charNum];
            }
            if (checkCode) {
                checkCode.className = "code";
                userInfoVM.showCode(_this.tempCode);
            }
        },
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
            switch (userInfoVM.sex()) {
                case '男': sex = '1'; break;
                case '保密': sex = '0'; break;
                case '女': sex = '2'; break;
            }
            var userInfo = {
                openid: _this.openId,
                nickName: userInfoVM.nickName(),
                sex: sex,
                email: userInfoVM.email(),
                vcode: userInfoVM.vcode(),
                address: userInfoVM.region(),
                signature: userInfoVM.motto(),
                headimgurl: _this.headimgurl,
                passWord: "123456"
            };
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/user/' + userInfoVM.phone() + '/regist', userInfo, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    localStorage.token = data.data.token;
                    localStorage.uid = data.data.uid;
                    window.location.href = "user.html";
                }
            }).error(function () {
                $('#my-modal-loading').modal('close');
            });
        }
    }
    userInfoVM.inputPhotoCode.subscribe(function (newValue) {
        var inputCode = userInfoVM.inputPhotoCode();
        if (inputCode.length <= 0) {
            _this.noticeVM.notice('请输入验证码！');
            $('#notice-alert').modal('open');
            userInfoVM.canInputPhone(false);
        }
        else if (inputCode.toUpperCase() != _this.tempCode.toUpperCase()) {
            userInfoVM.inputPhotoCode('');
            _this.noticeVM.notice('验证码输入有误！');
            $('#notice-alert').modal('open');
            userInfoVM.createCodeClick();
            userInfoVM.canInputPhone(false);
        }
        else {
            userInfoVM.canInputPhone(true);
        }
    });
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
            _this.noticeVM.notice('请选择图片文件！');
            $('#notice-alert').modal('open');
        } else {
            pushImg(obj);
        }
    }
    function pushImg(obj) {
        //var url = "upload/"; //访问控制器是upload，后面必须加'/'否则会报错"org.apache.catalina.connector.RequestFacade cannot be cast to org.springframework.web.multipart.Mult...",但是如果是多级的URL【例如XX/XXX/00/upload/0】又没问题了.
        var url = "www.hanzhendata.com/ihanzhendata/user/4a0e6c4378f34828b6e8891ff2986b64/headpicture";
        var files = $("#fileBtn").get(0).files[0]; //获取file控件中的内容
        if (files.size > 5 * 1024 * 1024) {
            _this.noticeVM.notice('图片最大为5M！');
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
                    var jsonString = JSON.stringify(data);
                    //$("#txtTd").text(jsonString)
                    console.log(jsonString);
                    var fileurl = window.URL.createObjectURL(obj.files[0]);
                    $("#portrait").css({ 'background': 'url(' + fileurl + ') no-repeat center', 'background-size': '100% 100%' });
                }
            },
            error: function (msg) {
                $('#my-modal-loading').modal('close');
                alert("error");
            }
        });
    }
}

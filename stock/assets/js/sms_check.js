$(function () {
    var phoneManagement = new PhoneManagement();
    phoneManagement.init();
})
var PhoneManagement = function () {
    var _this = this;
    _this.openId = "";
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.confirmVM = {
        bodyText: ko.observable(''),
        cancelText: ko.observable(''),
        confirmText: ko.observable(''),
    };
    _this.init = function () {
        ko.applyBindings(phoneVM, $("#phone-container")[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        initGraphCode();
    };
    //view model
    var phoneVM = {
        phone: ko.observable(''),
        msgvcode: ko.observable(''),
        verifyText: ko.observable('发送验证码'),
        //showCode: ko.observable(''),
        canInputPhone: ko.observable(false),
        graphcode: ko.observable(''),
        canVerify: ko.observable(false),
        verifyClick: function () {
            var phone = this.phone().trim();
            if (_this.code2.verify(phoneVM.graphcode()) == false) {
                _this.noticeVM.notice('图形验证码输入有误！');
                $('#notice-alert').modal('open');
                $("#vCode2").click();
                phoneVM.graphcode('');
                return;
            }
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
                    })(phoneVM);
                },
                onCancel: function () {
                }
            });
        },
        saveClick: function () {
            //if (document.getElementById("code2").value == "") {
            //    _this.noticeVM.notice('请输入图形验证码！');
            //    $('#notice-alert').modal('open');
            //    $("#vCode2").click();
            //phoneVM.graphcode('');
            //    return;
            //}
            //if (_this.code2.verify(document.getElementById("code2").value) == false) {
            //    _this.noticeVM.notice('图形验证码输入有误！');
            //    $('#notice-alert').modal('open');
            //    $("#vCode2").click();
            //phoneVM.graphcode('');
            //    return;
            //}
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/user/' + phoneVM.phone() + '/regist', {
                vcode: phoneVM.msgvcode(),
                uid: localStorage.uid
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data && data.status == 1) {
                    localStorage.token = data.data.token;
                    localStorage.uid = data.data.uid;
                    window.location.href = "home.html";
                } else {
                    _this.noticeVM.notice('提交失败，请重新绑定！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                $('#my-modal-loading').modal('close');
                _this.noticeVM.notice('提交失败，请重新绑定！');
                $('#notice-alert').modal('open');
            });
        }
    }
    phoneVM.graphcode.subscribe(function (newValue) {
        var inputCode = phoneVM.graphcode();
        if (inputCode.length = 0) {
            _this.noticeVM.notice('请输入图形验证码！');
            $('#notice-alert').modal('open');
            phoneVM.canInputPhone(false);
            $("#vCode2").click();
            phoneVM.graphcode('');
        }
        else if (_this.code2.verify(inputCode) == false) {
            _this.noticeVM.notice('图形验证码输入有误！');
            $('#notice-alert').modal('open');
            phoneVM.canInputPhone(false);
            $("#vCode2").click();
            phoneVM.graphcode('');
        }
        else if (_this.code2.verify(inputCode) == true) {
            phoneVM.canInputPhone(true);
        }
    });
    phoneVM.phone.subscribe(function (newValue) {
        var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
        if (pRegex.test(newValue.trim())) {
            phoneVM.canVerify(true);
            //$("#verifyBtn").addClass('am-btn-warning');
        }
        else {
            phoneVM.canVerify(false);
            //$("#verifyBtn").removeClass('am-btn-warning');
        }
    });
    var initGraphCode = function () {
        var container2 = document.getElementById("vCode2");
        _this.code2 = new vCode(container2, {
            len: 5,
            bgColor: "#444444",
            colors: [
                "#DDDDDD",
                "#DDFF77",
                "#77DDFF",
                "#99BBFF",
                //"#7700BB",
                "#EEEE00"
            ]
        });
    }
}

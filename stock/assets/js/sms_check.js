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
        graphcode: ko.observable(''),
        canVerify: ko.observable(false),
        isgraphCodeFocus: ko.observable(true),
        isPhoneFocus: ko.observable(false),
        showTanhao: ko.observable(false),
        showRight: ko.observable(false),
        verifyClick: function () {
            var phone = this.phone().trim();
            if (_this.code2.verify(phoneVM.graphcode()) == false) {
                _this.noticeVM.notice('图形验证码输入有误！');
                $('#notice-alert').modal('open');
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
                            o.verifyText(wait.toString() + '秒后重发');
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
            if (phoneVM.graphcode() == "" || phoneVM.phone() == "" || phoneVM.msgvcode() == "") {
                return;
            }
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/user/' + phoneVM.phone() + '/regist', {
                vcode: phoneVM.msgvcode(),
                uid: localStorage.uid,
                token: localStorage.token != undefined ? localStorage.token : ""
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data && data.status == 1) {
                    if (localStorage.token == undefined) {
                        localStorage.token = data.data.token;
                        localStorage.uid = data.data.uid;
                    }
                    _this.noticeVM.notice('绑定成功！');
                    $('#notice-alert').modal('open');
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
        if (inputCode.length < 4) {
            phoneVM.showRight(false);
            phoneVM.showTanhao(false);
            return;
        } else {
            if (_this.code2.verify(inputCode) == false) {
                phoneVM.showRight(false);
                phoneVM.showTanhao(true);
            } else if (_this.code2.verify(inputCode) == true) {
                phoneVM.isgraphCodeFocus(false);
                phoneVM.isPhoneFocus(true);
                phoneVM.showTanhao(false);
                phoneVM.showRight(true);
            }
        }
    });
    phoneVM.phone.subscribe(function (newValue) {
        var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
        if (pRegex.test(newValue.trim())) {
            phoneVM.canVerify(true);
        }
        else {
            phoneVM.canVerify(false);
        }
    });
    var initGraphCode = function () {
        var container2 = document.getElementById("vCode2");
        _this.code2 = new vCode(container2, {
            len: 4,
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

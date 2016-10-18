$(function () {
    if (localStorage.token) {
        window.location.href = "user.html";//已登录会跳转到这个页面
    }
    else {
        var registerVM = {
            email: ko.observable(''),
            //nickName: ko.observable(''),
            password: ko.observable(''),
            phone: ko.observable(''),
            vcode: ko.observable(''),
            canVerify: ko.observable(false),
            //canRegister: ko.observable(false),
            verifyText: ko.observable('发送验证码'),
            notice: ko.observable(''),
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
                        })(registerVM);
                    },
                    onCancel: function () {
                    }
                });
            },
            registerSubmitClick: function () {
                var _vm = registerVM, cantRegister = true;
                var email = _vm.email().trim(),
                    passWord = _vm.password().trim(),
                    vcode = _vm.vcode().trim(),
                    phone = _vm.phone().trim();
                var eRegex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                    passRegex = /^[0-9A-Za-z]{6,16}$/,
                    pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/,
                    vRegex = /^\d{5}$/;
                if (!email) {
                    _vm.notice('邮箱不能为空');
                }
                else if (!passWord) {
                    _vm.notice('密码不能为空');
                }
                else if (!phone) {
                    _vm.notice('手机号不能为空');
                }
                else if (!vcode) {
                    _vm.notice('验证码不能为空');
                }
                else if (!eRegex.test(email)) {
                    _vm.notice('您输入的电子邮箱格式不正确，请重新输入');
                }
                else if (!passRegex.test(passWord)) {
                    _vm.notice('您输入的密码格式不正确，请输入6-16个数字或字母');
                }
                else if (!pRegex.test(phone)) {
                    _vm.notice('您输入的手机号格式不正确，请重新输入');
                }
                else if (!vRegex.test(vcode)) {
                    _vm.notice('您输入的验证码格式不正确，请重新输入');
                }
                else {
                    cantRegister = false;
                    var registerInfo = {
                        email: email,
                        passWord: passWord,
                        vcode: vcode
                    };
                    $('#my-modal-loading').modal('open');
                    $.ajax({
                        url: "/ihanzhendata/user/" + phone + "/regist",
                        type: "Post",
                        data: registerInfo,
                        dataType: 'json',
                        context: null,
                        success: function (data) {
                            $('#my-modal-loading').modal('close');
                            $('#my-confirm').modal({
                                onConfirm: function () {
                                    window.location.href = "user.html";
                                },
                                onCancel: function () {
                                    window.location.href = "home.html";
                                }
                            });
                        }
                    });
                }
                if (cantRegister) {
                    $('#my-alert').modal('open');
                }
            }
        };
        registerVM.phone.subscribe(function (newValue) {
            var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
            if (pRegex.test(newValue.trim())) {
                registerVM.canVerify(true);
                $("#verifyBtn").addClass('am-btn-warning');
            }
            else {
                registerVM.canVerify(false);
                $("#verifyBtn").removeClass('am-btn-warning');
            }
        });
        ko.applyBindings(registerVM, $("#register-container")[0]);
    }
})


//function initValidation() {
//    if ($.AMUI && $.AMUI.validator) {
//        $.AMUI.validator.patterns.mobile = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
//        $.AMUI.validator.patterns.nickname = /^[0-9a-zA-Z\u4e00-\u9fa5_]{1,8}$/;
//        $.AMUI.validator.patterns.password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
//        $.AMUI.validator.patterns.vcode = /^\d{5}$/;
//    }
//}
//initValidation();



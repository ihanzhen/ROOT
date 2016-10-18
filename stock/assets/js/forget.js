$(function () {
    if (localStorage.token) {
        window.location.href = "user.html";//已登录会跳转到这个页面
    }
    else {
        var forgetVM = {
            newPassword: ko.observable(''),
            confirmPassword: ko.observable(''),
            phone: ko.observable(''),
            vcode: ko.observable(''),
            canVerify: ko.observable(false),
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
                        })(forgetVM);
                    },
                    onCancel: function () {
                    }
                });
            },
            registerSubmitClick: function () {
                var _vm = forgetVM, cantNext = true;
                var newp = _vm.newPassword().trim(),
                    comfirmp = _vm.confirmPassword().trim(),
                    vcode = _vm.vcode().trim(),
                    phone = _vm.phone().trim();
                var eRegex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                    passRegex = /^[0-9A-Za-z]{6,16}$/,
                    pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/,
                    vRegex = /^\d{5}$/;
                if (!phone) {
                    _vm.notice('注册手机号不能为空');
                }
                else if (!vcode) {
                    _vm.notice('验证码不能为空');
                }
                else if (!newp) {
                    _vm.notice('新密码不能为空');
                }
                else if (!comfirmp) {
                    _vm.notice('确认密码不能为空');
                }
                else if (!pRegex.test(phone)) {
                    _vm.notice('您输入的手机号格式不正确，请重新输入');
                }
                else if (!vRegex.test(vcode)) {
                    _vm.notice('您输入的验证码格式不正确，请重新输入');
                }
                else if (!passRegex.test(newp)) {
                    _vm.notice('您输入的新密码格式不正确，请输入6-16个数字或字母');
                }
                else if (!passRegex.test(comfirmp)) {
                    _vm.notice('您输入的确认密码格式不正确，请输入6-16个数字或字母');
                }
                else if (newp != comfirmp) {
                    _vm.notice('两次密码输入不一致，请重新输入');
                }
                else {
                    cantNext = false;
                    var retrieveInfo = {
                        npassWord: newp,
                        vcode: vcode
                    }
                    $('#my-modal-loading').modal('open');
                    $.ajax({
                        url: "/ihanzhendata/user/" + phone + "/npassword",
                        type: "Post",
                        data: retrieveInfo,
                        dataType: 'json',
                        context: null,
                        success: function (data) {
                            $('#my-modal-loading').modal('close');
                            window.location.href = "login.html";
                        }
                    });
                }
                if (cantNext) {
                    $('#my-alert').modal('open');
                }
            }
        };
        forgetVM.phone.subscribe(function (newValue) {
            var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
            if (pRegex.test(newValue.trim())) {
                forgetVM.canVerify(true);
                $("#verifyBtn").addClass('am-btn-warning');
            }
            else {
                forgetVM.canVerify(false);
                $("#verifyBtn").removeClass('am-btn-warning');
            }
        });
        ko.applyBindings(forgetVM, $("#forget-container")[0]);
    }
})




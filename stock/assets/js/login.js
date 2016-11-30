$(function () {
    if (localStorage.token) {
        window.location.href = "user.html";//已登录会跳转到这个页面
    }
    else {
        var loginVM = {
            username: ko.observable(''),
            password: ko.observable(''),
            notice: ko.observable(''),
            loginSubmitClick: function () {
                var _vm = loginVM,cantLogin=true;
                var loginName = _vm.username().trim(),
                    passWord = _vm.password().trim();
                //var eRegex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                //    passRegex = /^[0-9A-Za-z]{6,16}$/,
                //    pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
                if (!loginName) {
                    _vm.notice('账号不能为空');
                }
                else if (!passWord) {
                    _vm.notice('密码不能为空');
                }
                //else if (!eRegex.test(username) || !pRegex.test(username)) {
                //    _vm.notice('您输入的账号格式不正确，请重新核对后再输入');
                //}
                //else if (!passRegex.test(passWord)) {
                //    _vm.notice('您输入的密码格式不正确，请输入6-16个数字或字母');
                //}
                else {
                    cantLogin = false;
                    var loginInfo = {
                        loginName: loginName,
                        passWord: passWord
                    }
                    $('#my-modal-loading').modal('open');
                    $.ajax({
                        url: "/ihanzhendata/user/login",
                        type: "Post",
                        data: loginInfo,
                        dataType: 'json',
                        context: null,
                        success: function (data) {
                            $('#my-modal-loading').modal('open');
                            if (data.status == 1) {
                                cantLogin = true;
                                var info = data.data;
                                localStorage.token = info.token;
                                localStorage.nickName = info.nickName;
                                localStorage.loginName = info.loginName;
                                $('#my-modal-loading').modal('close');
                                window.location.href = "home.html";//登陆成功后跳转到这个页面
                            } else {
                                console.log(data.msg);
                            }
                        },
                        error: function () {
                            console.log('login fail');
                            $('#my-modal-loading').modal('close');
                        }
                    });
                }
                if (cantLogin) {
                    $('#my-alert').modal('open');
                }
            }
        };
        ko.applyBindings(loginVM, $("#login-container")[0]);
    }
})


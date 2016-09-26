$(function () {
    if (localStorage.token) {
        window.location.href = "../home.html";//已登录会跳转到这个页面
    }
    else {
        var retrievepdManagement = new RetrievePDManagement();
        retrievepdManagement.init();
    }
})
function initValidation() {
    if ($.AMUI && $.AMUI.validator) {
        $.AMUI.validator.patterns.mobile = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
        $.AMUI.validator.patterns.password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        $.AMUI.validator.patterns.vcode = /^\d{4}$/;
    }
}
initValidation();
var RetrievePDManagement = function () {
    var _this = this;
    var ViewModel = function () {
        var _vm = this;
        _vm.username = ko.observable('');
        _vm.vcode = ko.observable('');
        _vm.newPassword = ko.observable('');
        _vm.confirmPassword = ko.observable('');
        _vm.canVerify = ko.observable(false);
        _vm.canRetrieve = ko.observable(false);
        _vm.verificationClick = function () {
            //判断手机号是否合法，合法传给后台，否则return
            var phoneNumber = this.username().trim();
            $('#my-confirm').modal({
                onConfirm: function (options) {
                    $.ajax({
                        url: "/ihanzhendata/user/" + phoneNumber + "/sendsms",
                        type: "Get",
                        context: null,
                        success: function (data) {

                        }
                    });
                },
                onCancel: function () {
                }
            });
        }
        _vm.retrieveClick = function () {
            var userName=_vm.username(),
                vcode=_vm.vcode(),
                newPassword=_vm.newPassword(),
                confirmPassword=_vm.confirmPassword();
            if(newPassword!=confirmPassword){
                return false;//两次密码不一致
            }
            if (userName && vcode && newPassword && confirmPassword && !$('#retrieve-form input').hasClass('am-field-error')) {
                console.log("can retrieve password");
                var retrieveInfo = {
                    npassWord: newPassword,
                    vcode: vcode
                }
                $.ajax({
                    url: "/ihanzhendata/user/"+username+"/npassword",
                    type: "Post",
                    data: retrieveInfo,
                    dataType: 'json',
                    context: null,
                    success: function (data) {
                        console.log('retrieve password success');
                        window.location.href = "login.html";
                    }
                });
            }
        };
        _vm.username.subscribe(function (newValue) {
            var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
            if (pRegex.test(newValue.trim())) {
                _vm.canVerify(true);
            }
            else {
                _vm.canVerify(false);
            }
        });
        _vm.confirmPassword.subscribe(function (newValue) {
            var pRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            if (pRegex.test(newValue.trim())) {
                _vm.canRetrieve(true);
            }
            else {
                _vm.canRetrieve(false);
            }
        });
    };
    _this.init = function () {
        _this.viewModel = new ViewModel();
        ko.applyBindings(_this.viewModel, $('#retrievepd-container')[0]);
    };
}
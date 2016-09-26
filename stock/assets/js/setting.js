$(function () {
    if (!localStorage.token) {
        window.location.href = "login.html";//haven't login
    }
    else {
        //have login
        var viewModel = {
            logoutClick: function () {
                $('#my-confirm').modal({
                    onConfirm: function (options) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("nickName");
                        localStorage.removeItem("loginName");
                        window.location.href = "login.html";
                    },
                    onCancel: function () {
                    }
                });
            }
        }
        ko.applyBindings(viewModel, $('#setting-container')[0]);
    }
})
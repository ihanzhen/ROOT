$(function () {
    if (localStorage.token) {
        window.location.href = "../home.html";//已登录会跳转到这个页面
    }
    else {
        $("#nickName").text(localStorage.nickName);
        //function ViewModel(){
        //    this.nickName = localStorage.nickName;
        //}
        //ko.applyBindings(new ViewModel(), $('#user-container')[0]);
    }
})
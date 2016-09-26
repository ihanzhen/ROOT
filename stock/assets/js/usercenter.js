$(function () {
    if (!localStorage.token) {
        window.location.href = "login.html";//haven't login
    }
    else {
        $("#nickName").text(localStorage.nickName);
        //function ViewModel(){
        //    this.nickName = localStorage.nickName;
        //}
        //ko.applyBindings(new ViewModel(), $('#user-container')[0]);
    }
})
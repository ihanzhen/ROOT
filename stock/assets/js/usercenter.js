$(function () {
    if (localStorage.token) {
        window.location.href = "../home.html";//�ѵ�¼����ת�����ҳ��
    }
    else {
        $("#nickName").text(localStorage.nickName);
        //function ViewModel(){
        //    this.nickName = localStorage.nickName;
        //}
        //ko.applyBindings(new ViewModel(), $('#user-container')[0]);
    }
})
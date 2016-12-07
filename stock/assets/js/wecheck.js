(function () {
    var wecheckManagement = new WeCheckManagement();
    wecheckManagement.init();
})();
function WeCheckManagement() {
    var _this = this;
    _this.init = function () {
        if (localStorage.openId) {
            _this.wxcheck();
        } else {
            window.location.href = "http://www.hanzhendata.com/ihanzhendata/user/wxlogin";
        }
    }
    _this.wxcheck = function () {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var result = JSON.parse(xmlhttp.responseText);
                if (result && result.status) {
                    if (result.status == 2000) {//未关注微信号
                        window.location.href = 'wechat_follow.html';
                    }
                    else if (result.status == 2001) {//首次接触，显示welcome.html
                        _this.initLocalStorage(result.data);
                        window.location.href = "welcome.html";
                    } else if (result.status == 2002) {//未填写手机号
                        _this.initLocalStorage(result.data);
                        window.location.href = "sms_check.html";
                    } else if (result.status == 2003) {//老用户
                        _this.initLocalStorage(result.data);
                        localStorage.token = result.data.token;
                    } else if (result.status == 2005) {//没查出信息来
                        window.location.href = "http://www.hanzhendata.com/ihanzhendata/user/wxlogin";
                    }
                    else {
                        alert('wxcheck ajax return unknown user status.Please contact system administrator.');
                    }
                } else {
                    alert('wxcheck ajax return unknown response data.Please contact system administrator.');
                }
            }
        }
        xmlhttp.open("POST", "/ihanzhendata/user/wxcheck", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("openId=" + localStorage.openId);
    }
    _this.initLocalStorage = function (user) {
        localStorage.uid = user.uid;
        localStorage.headImgUrl = user.headImgUrl;
        localStorage.sex = user.sex;
        localStorage.city = user.city;
        localStorage.country = user.country;
        localStorage.nickname = user.nickname;
        localStorage.province = user.province;
    }
};
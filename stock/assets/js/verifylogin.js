(function () {
    var token = localStorage.token, uid = localStorage.uid;
    if (!token || !uid) {
        window.location.href = "wechat_follow.html";
        return;
    }
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var result = JSON.parse(xmlhttp.responseText);
                if (result.status && result.status == 1) {
                    console.log(result.msg);
                } else {
                    window.location.href = "home.html";
                }
            }
            else {
                window.location.href = "404.html";
            }
        }
    }
    xmlhttp.open("GET", "/ihanzhendata/user/jurisdiction?token=" + token + "&uid=" + uid, true);
    xmlhttp.send();
})();
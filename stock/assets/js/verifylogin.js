(function () {
    var token = localStorage.token, uid = localStorage.uid;
    if (!token || !uid) {
        window.location.href = "http://www.hanzhendata.com/ihanzhendata/user/wxlogin";
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
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText);
            if (result.status && result.status == 1) {
                console.log(result.msg);
            } else {
                window.location.href = "http://www.hanzhendata.com/ihanzhendata/user/wxlogin";
            }
        }
    }
    xmlhttp.open("GET", "/ihanzhendata/user/jurisdiction?token=" + token + "&uid=" + uid, true);
    xmlhttp.send();
})();
(function () {
    //var store = $.AMUI.store;
    //if (!store.enabled) {
    //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
    //    return;
    //}
    var token = localStorage.token, uid = localStorage.uid;
    //var token = 'fb984967dd654d179158abe02618458f', uid = '4a0e6c4378f34828b6e8891ff2986b64';
    if (!token || !uid) {
        window.location.href = "wechatlogin.html";
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
            var result=JSON.parse(xmlhttp.responseText);
            if (result.status == 1) {
                console.log(result.msg);
            }else {
                window.location.href = "wechatlogin.html";
            }
        }
    }
    xmlhttp.open("GET", "/ihanzhendata/user/jurisdiction?token="+token+"&uid="+uid, true);
    xmlhttp.send();
})();
(function ($) {
    $.request = (function () {
        var apiMap = {};
        function request(queryStr) {
            var api = {};
            if (apiMap[queryStr]) { return apiMap[queryStr]; }
            api.queryString = (function () {
                var urlParams = {};
                var e,
                d = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); },
                q = queryStr.substring(queryStr.indexOf('?') + 1),
                r = /([^&=]+)=?([^&]*)/g;
                while (e = r.exec(q)) urlParams[d(e[1])] = d(e[2]);
                return urlParams;
            })();
            api.getUrl = function () {
                var url = queryStr.substring(0, queryStr.indexOf('?') + 1);
                for (var p in api.queryString) { url += p + '=' + api.queryString[p] + "&"; }
                if (url.lastIndexOf('&') == url.length - 1) { return url.substring(0, url.lastIndexOf('&')); }
                return url;
            }
            apiMap[queryStr] = api;
            return api;
        }
        $.extend(request, request(window.location.href));
        return request;
    })();
}(jQuery));





(function ($) {
    Date.prototype.Format = function (formatStr) {
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, this.getFullYear());
        str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

        str = str.replace(/MM/, this.getMonth() + 1 > 9 ? (this.getMonth() + 1).toString() : '0' + this.getMonth() + 1);
        str = str.replace(/M/g, this.getMonth() + 1);

        str = str.replace(/w|W/g, Week[this.getDay()]);

        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
        str = str.replace(/d|D/g, this.getDate());

        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
        str = str.replace(/h|H/g, this.getHours());
        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
        str = str.replace(/m/g, this.getMinutes());

        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
        str = str.replace(/s|S/g, this.getSeconds());

        return str;
    }
}(jQuery));

$(function () {
    var loadingDiv = $('<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="my-modal-loading">' +
                  '   <div class="am-modal-dialog" style="box-shadow:none;background:transparent">' +
                  '      <div class="am-modal-bd">' +
                  '         <span class="am-icon-spinner am-icon-spin"></span>' +
                  '      </div>' +
                  '   </div>' +
                  '</div>');
    $('body').append(loadingDiv);
});
window.stock = {};
window.stock.loading = function (isShow) {
    if (isShow) {
        $('#my-modal-loading').modal('open');
    } else {
        $('#my-modal-loading').modal('close');
    }
}
window.stock.logmsg = function (data) {
    if (data) {
        console.log(data.msg + ",status:" + data.status);
    } 
}

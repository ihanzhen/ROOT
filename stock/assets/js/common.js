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

        str = str.replace(/MM/, this.getMonth() + 1 > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1).toString());
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
    //loading
    var loadingDiv =  $('<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="my-modal-loading">' +
                        '   <div class="am-modal-dialog" style="box-shadow:none;background:transparent">' +
                        '      <div class="am-modal-bd">' +
                        '         <span class="am-icon-spinner am-icon-spin"></span>' +
                        '      </div>' +
                        '   </div>' +
                        '</div>');
    $('body').append(loadingDiv);

    //select selfselect category
    var confirmDiv = $('<div class="am-modal am-modal-confirm" tabindex="-1" id="confirm-alert">'+
                            '<div class="am-modal-dialog">'+
                            '    <div class="am-modal-hd">系统提示</div>'+
                            '    <div class="am-modal-bd" style="">'+
                            '        <p>请选择自选类别</p>'+
                            '        <ul class="am-list" style="padding-left:10px;margin-top:-10px;margin-bottom:-10px">'+
                            '            <li style="text-align:left;padding-left:20px;border:0 none;height:45px;line-height:45px" data-bind="click:selectFirstClick">'+
                            '                <input type="radio" name="selfSelect" value="1" data-bind="checked: select" />'+
                            '                 <label>自选 1</label>'+
                            '                （<span data-bind="text:firstMark"></span>）'+
                            '            </li>'+
                            '            <li style="text-align:left;padding-left:20px;border:0 none;height:45px;line-height:45px" data-bind="click:selectSecondClick">'+
                            '                <input type="radio" name="selfSelect" value="2" data-bind="checked: select" />'+
                            '                <label>自选 2</label>'+
                            '                （<span data-bind="text:secondMark"></span>）'+
                            '            </li>'+
                            '            <li style="text-align:left;padding-left:20px;border:0 none;height:45px;line-height:45px" data-bind="click:selectThirdClick">'+
                            '                <input type="radio" name="selfSelect" value="3" data-bind="checked: select" />'+
                            '                <label>自选 3</label>'+
                            '                （<span data-bind="text:thirdMark"></span>）'+
                            '            </li>'+
                            '        </ul>'+
                            '    </div>'+
                            '    <div class="am-modal-footer">'+
                            '        <span class="am-modal-btn" data-bind="click:cancelClick">取消</span>'+
                            '        <span class="am-modal-btn" data-bind="click:confirmClick">确定</span>'+
                            '    </div>'+
                            '</div>'+
                            '</div>');
    $('body').append(confirmDiv);

    var noticeAlertDiv = $('<div class="am-modal am-modal-alert" tabindex="-1" id="notice-alert">'+
                           '     <div class="am-modal-dialog">'+
                           '         <div class="am-modal-hd">系统提示</div>'+
                           '         <div class="am-modal-bd" data-bind="text:notice"></div>'+
                           '         <div class="am-modal-footer">'+
                           '             <span class="am-modal-btn" data-am-modal-confirm style="color:#fff">确定</span>'+
                           '         </div>'+
                           '     </div>'+
                           ' </div>');
    $('body').append(noticeAlertDiv);
    ko.applyBindings(confirmVM, $('#confirm-alert')[0]);
    ko.applyBindings(noticeVM, $('#notice-alert')[0]);
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

function addorDeleteSelfSelect(item) {
    //var item = stock;
    if (item.isSelfSelect()) {
        window.stock.loading(true);
        $.ajax({
            url: '/ihanzhendata/selfStock/deleteSelfStock',
            method: 'POST',
            data: {
                uid: localStorage.uid,
                stock_code: item.scode()
            },
            success: function (result) {
                window.stock.loading(false);
                if (result && result.status == 1) {
                    noticeVM.notice('自选股删除成功！');
                    $('#notice-alert').modal('open');
                    item.isSelfSelect(false);
                } else {
                    noticeVM.notice('自选股删除失败！');
                    $('#notice-alert').modal('open');
                }
            },
            error: function () {
                window.stock.loading(false);
                noticeVM.notice('自选股删除失败！');
                $('#notice-alert').modal('open');
            }
        });
    } else {
        confirmVM.item = item;
        confirmVM.stockCode = item.scode();
        confirmVM.stockName = item.sname();
        if (localStorage.s_zx1 != undefined && localStorage.s_zx2 != undefined && localStorage.s_zx3 != undefined) {
            confirmVM.firstMark(localStorage.s_zx1);
            confirmVM.secondMark(localStorage.s_zx2);
            confirmVM.thirdMark(localStorage.s_zx3);
            $('#confirm-alert').modal();
        }
        else {
            window.stock.loading(true);
            $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) {
                window.stock.loading(false);
                if (data && data.data) {
                    var bzdata = data.data;
                    confirmVM.firstMark(bzdata.s_zx1);
                    confirmVM.secondMark(bzdata.s_zx2);
                    confirmVM.thirdMark(bzdata.s_zx3);
                }
                $('#confirm-alert').modal();
            }).error(function () {
                window.stock.loading(false);
            });
        }
    }
}
function array2urlstr(arr, codenameStr) {
    var tempArr = [];
    for (var i = 0; i < arr.length; i++) {
        var str = codenameStr + "=" + arr[i];
        tempArr.push(str);
    }
    return tempArr.join("&");
}
//查询 是否自选 事件
function getSelftSelectEvent(arr, vm) {
    var url = '/ihanzhendata/logicstocks/selfstocks/' + localStorage.uid;
    var sendData = array2urlstr(arr, "stock_code");
    //$('.loadspan').show();
    $.get(url, sendData, function (data) {
        $('.loadspan').hide();
        if (data && data.data) {
            var stockList = data.data;
            for (var i = 0; i < vm.items().length; i++) {
                for (var j = 0; j < stockList.length; j++) {
                    if (vm.items()[i].scode() == stockList[j].stock_code) {
                        vm.items()[i].isSelfSelect(Boolean(parseInt(stockList[j].is_zxg)));
                        vm.items()[i].isEvent(Boolean(parseInt(stockList[j].is_logic)));
                        break;
                    }
                }
            }
        }
    }).error(function () {
        $('.loadspan').hide();
    });
}
var noticeVM = {
    notice: ko.observable(''),
    show: function () {
        $("notice-alert").modal("open");
    }
};
var confirmVM = {
    item: null,
    stockCode: '',
    stockName: '',
    select: ko.observable('1'),
    firstMark: ko.observable(''),
    secondMark: ko.observable(''),
    thirdMark: ko.observable(''),
    selectFirstClick: function () {
        confirmVM.select('1');
    },
    selectSecondClick: function () {
        confirmVM.select('2');
    },
    selectThirdClick: function () {
        confirmVM.select('3');
    },
    cancelClick: function () { },
    confirmClick: function () {
        window.stock.loading(true);
        $.post('/ihanzhendata/selfStock/saveSelfStock', {
            uid: localStorage.uid,
            stock_code: confirmVM.stockCode,
            stock_name: confirmVM.stockName,
            b_zx: confirmVM.select()
        }, function (data) {
            window.stock.loading(false);
            if (data.status == 1) {
                noticeVM.notice('添加自选成功！');
                $('#notice-alert').modal('open');
                if (confirmVM.item) {//个股详情加自选区别于股池
                    confirmVM.item.isSelfSelect(true);
                }
            } else if (data.status == 12008) {
                noticeVM.notice('自选已存在，不用重复添加！');
                $('#notice-alert').modal('open');
            } else {
                noticeVM.notice('添加自选失败！');
                $('#notice-alert').modal('open');
            }
        }).error(function () {
            window.stock.loading(false);
            noticeVM.notice('添加自选失败！');
            $('#notice-alert').modal('open');
        });
    }
}
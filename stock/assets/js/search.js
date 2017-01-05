$(function () {
    var searchManagement = new SearchManagement();
    searchManagement.init();
})
var SearchManagement = function () {
    var _this = this;
    function initAutocomplete() {
        $('#autocomplete-ajax').autocomplete({
            minChars: 1,
            serviceUrl: '/ihanzhendata/stock/matchStocks',
            onSelect: function (suggestion) {
            },
            onHint: function (hint) {
                //$('#autocomplete-ajax-x').val(hint);
            },
            onInvalidateSelection: function () {
            },
            showNoSuggestionNotice: false,
            noSuggestionNotice: '',
            viewmodel: searchVM,
            getStockInfo: function (stocks) {
                getSelftSelectEvent(stocks);
            },
            //getStarsInfo:function(stocks){
            //    getLabelStars(stocks);
            //},
            Stock:Stock
        });
    }
    _this.noticeVM = {
        notice: ko.observable('')
    };
    _this.confirmVM = {
        stockCode: '',
        stockName: '',
        select: ko.observable('1'),
        firstMark: ko.observable(''),
        secondMark: ko.observable(''),
        thirdMark: ko.observable(''),
        selectFirstClick: function () {
            _this.confirmVM.select('1');
        },
        selectSecondClick: function () {
            _this.confirmVM.select('2');
        },
        selectThirdClick: function () {
            _this.confirmVM.select('3');
        },
        cancelClick: function () { },
        confirmClick: function () {
            $('#my-modal-loading').modal('open');
            $.post('/ihanzhendata/selfStock/saveSelfStock', {
                uid: localStorage.uid,
                stock_code: _this.confirmVM.stockCode,
                stock_name: _this.confirmVM.stockName,
                b_zx: _this.confirmVM.select()
            }, function (data) {
                $('#my-modal-loading').modal('close');
                if (data.status == 1) {
                    _this.noticeVM.notice('添加自选成功！');
                    $('#notice-alert').modal('open');
                    searchVM.items([]);
                    //$('#autocomplete-ajax').Autocomplete.suggest();
                    //to do...刷新列表
                } else if (data.status == 12008) {
                    _this.noticeVM.notice('自选已存在，不用重复添加！');
                    $('#notice-alert').modal('open');
                } else {
                    _this.noticeVM.notice('添加自选失败！');
                    $('#notice-alert').modal('open');
                }
            }).error(function () {
                $('#my-modal-loading').modal('close');
                _this.noticeVM.notice('添加自选失败！');
                $('#notice-alert').modal('open');
            });
        }
    }
    var searchVM={
        inputText: ko.observable(''),
        searchClick: function () {

        },
        items:ko.observableArray([])
    }
    function Stock(scode,sname) {
        this.scode= ko.observable(scode);
        this.sname = ko.observable(sname);
        this.isSelfSelect = ko.observable(false);
        this.redirectClick = function (item) {
            window.location.href = "stock_details.html?stockCode=" + item.scode() + "&stockName=" + item.sname();
        };
        this.selectClick = function (item) {
            if (item.isSelfSelect()) {
                $('#my-modal-loading').modal('open');
                $.ajax({
                    url: '/ihanzhendata/selfStock/deleteSelfStock',
                    method: 'POST',
                    data: {
                        uid: localStorage.uid,
                        stock_code: item.scode()
                    },
                    success: function (result) {
                        $('#my-modal-loading').modal('close');
                        if (result && result.status == 1) {
                            _this.noticeVM.notice('自选股删除成功！');
                            $('#notice-alert').modal('open');
                            searchVM.items([]);
                            //to do...刷新列表
                            //$('#autocomplete-ajax').Autocomplete.suggest();
                        } else {
                            _this.noticeVM.notice('自选股删除失败！');
                            $('#notice-alert').modal('open');
                        }
                    },
                    error: function () {
                        $('#my-modal-loading').modal('close');
                        _this.noticeVM.notice('自选股删除失败！');
                        $('#notice-alert').modal('open');
                    }
                });
            } else {
                _this.confirmVM.stockCode = item.scode();
                _this.confirmVM.stockName = item.sname();
                if (localStorage.s_zx1 != undefined && localStorage.s_zx2 != undefined && localStorage.s_zx3 != undefined) {
                    _this.confirmVM.firstMark(localStorage.s_zx1);
                    _this.confirmVM.secondMark(localStorage.s_zx2);
                    _this.confirmVM.thirdMark(localStorage.s_zx3);
                    $('#confirm-alert').modal();
                }
                else {
                    $('#my-modal-loading').modal('open');
                    $.get('/ihanzhendata/selfStock/getSelfBz', { uid: localStorage.uid }, function (data) {
                        $('#my-modal-loading').modal('close');
                        if (data && data.data) {
                            var bzdata = data.data;
                            _this.confirmVM.firstMark(bzdata.s_zx1);
                            _this.confirmVM.secondMark(bzdata.s_zx2);
                            _this.confirmVM.thirdMark(bzdata.s_zx3);
                        }
                        $('#confirm-alert').modal();
                    }).error(function () {
                        $('#my-modal-loading').modal('close');
                    });
                }
            }
        }
    }
    ////查询是否是技术面股池和星级和是否是基本面股池
    //function getLabelStars(arr) {
    //    $('.loadspan').show();
    //    $.ajax({
    //        url: 'http://119.164.253.142:3307/api/v1.0/stockslabel/?' + array2urlstr(arr, 'windcode'),
    //        dataType: "jsonp",
    //        jsonpcallback: "jsonpcallback",
    //        timeout: 5000,
    //        type: "GET",
    //        success: function (data) {
    //            if (data && data.data) {
    //                $('.loadspan').hide();
    //                var resultArr = data.data;
    //                for (var i = 0; i < jibenVM.items().length; i++) {
    //                    for (var j = 0; j < resultArr.length; j++) {
    //                        if (jibenVM.items()[i].scode() == resultArr[j].windcode) {
    //                            jibenVM.items()[i].stars(resultArr[j].stars);
    //                            jibenVM.items()[i].isTechnology(Boolean(resultArr[j].is_jishu));
    //                            jibenVM.items()[i].isFundamental(Boolean(resultArr[j].is_jiben));
    //                            jibenVM.items()[i].isMain(Boolean(resultArr[j].is_mf));
    //                            break;
    //                        }
    //                    }
    //                }
    //            }

    //        }
    //    }).error(function () {
    //        console.log('error');
    //        $('.loadspan').hide();
    //    });
    //}
    function array2urlstr(arr, codenameStr) {
        var tempArr = [];
        for (var i = 0; i < arr.length; i++) {
            var str = codenameStr + "=" + arr[i];
            tempArr.push(str);
        }
        return tempArr.join("&");
    }
    //查询 是否自选 事件
    function getSelftSelectEvent(arr) {
        var url = '/ihanzhendata/logicstocks/selfstocks/' + localStorage.uid;
        var sendData = array2urlstr(arr, "stock_code");
        //$('.loadspan').show();
        $.get(url, sendData, function (data) {
            //$('.loadspan').hide();
            if (data && data.data) {
                var stockList = data.data;
                for (var i = 0; i < searchVM.items().length; i++) {
                    for (var j = 0; j < stockList.length; j++) {
                        if (searchVM.items()[i].scode() == stockList[j].stock_code) {
                            searchVM.items()[i].isSelfSelect(Boolean(parseInt(stockList[j].is_zxg)));
                            //searchVM.items()[i].isEvent(Boolean(parseInt(stockList[j].is_logic)));
                            break;
                        }
                    }
                }
            }
        }).error(function () {
            //$('.loadspan').hide();
        });
    }
    _this.init = function () {
        ko.applyBindings(searchVM, $('#search-container')[0]);
        ko.applyBindings(_this.confirmVM, $('#confirm-alert')[0]);
        ko.applyBindings(_this.noticeVM, $('#notice-alert')[0]);
        initAutocomplete();
    }
}
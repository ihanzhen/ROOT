$(function () {
    var bankuaiMoreManagement = new BankuaiMoreManagement();
    bankuaiMoreManagement.init();
})
var BankuaiMoreManagement = function () {
    var _this = this;
    var PlateVM = function () {
        _vm = this;
        _vm.items = ko.observableArray([]);

    };
    var pageNumber = 1; //设置当前页数，全局变量  
    var haslock = false;//是否锁上上拉加载
    var plateType = "";
    _this.init = function () {
        _this.plateVM = new PlateVM();
        var queryString = $.request(location.href).queryString;
        plateType = queryString.plateType;
        switch (plateType) {
            case 'recommend': $('#boardType').text('推荐版块'); break;
            case 'strong': $('#boardType').text('强势版块'); break;
            case 'anticipation': $('#boardType').text('蓄势版块'); break;
        }
        ko.applyBindings(_this.plateVM, $('#bankuai_more')[0]);
        _this.getPageData(plateType);
        $(window).scroll(scrollHandler);
        //var int = self.setInterval(_this.updatePlateAsync, 5 * 1000);
    }
    function Plate(plateCode, plateName, plateChange, plateValue, code, name) {
        this.plateCode = ko.observable(plateCode);
        this.plateName = ko.observable(plateName);
        //this.note = ko.observable('');
        this.plateChange = ko.observable(plateChange);
        this.plateValue = ko.observable(plateValue);
        this.headStockCode = ko.observable(code);
        this.headStockName = ko.observable(name);
        //this.type = ko.observable(type);
        this.detailsClick = function (item) {
            window.location.href = "bankuai_details.html?plateCode=" + item.plateCode() + '&plateType=' + plateType;//to do
        }
    };
    _this.getRecommendPlateData = function () {
        haslock = true;
        $(window).unbind('scroll');
        $.get('/ihanzhendata/stock/recommendPlate_Stock', function (result) {
            $('.loadspan').hide();
            $('.nomore').show();
            haslock = false;
            if (result && result.data) {
                var data = result.data;
                for (var i = 0; i < length; i++) {
                    var plate = new Plate(data[i].plate_id, data[i].plate_name);
                    plate.headStockCode(data[i].headstock_code);
                    plate.headStockName(data[i].headstock_name);
                    _this.recommendVM.plates.push(plate);
                }
            }
        }).error(function () {
            $('.loadspan').hide();
            haslock = false;
        });
    };
    _this.getStrongPlateData = function () {
        haslock = true;
        $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardstrong/'+pageNumber++,
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                $('.loadspan').hide();
                haslock = false;
                if (data && data.data&&data.data.length>0) {
                    var plateArray = data.data;
                    for (var i = 0; i < plateArray.length; i++) {
                        var stocklist = plateArray[i].stockslist;
                        if (stocklist && stocklist.length > 0) {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name, plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', stocklist[0].windcode, stocklist[0].name));
                        } else {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name,  plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', '', ''));
                        }
                    }
                } else if (data && data.data && data.data.length == 0) {
                    $('.loadspan').hide();
                    $(window).unbind('scroll');
                    $('.nomore').show();
                    $('#boardCount').text(_this.plateVM.items().length+'个');
                }
                if (pageNumber == 2) {
                    _this.getStrongPlateData();
                }
            }
        }).error(function () {
            $('.loadspan').hide();
            haslock = false;
        });
    };
    _this.getAnticipationPlateData = function () {
        haslock = true;
         $.ajax({
            url: 'http://119.164.253.142:3307/api/v1.0/stocksboardready/'+pageNumber++,
            dataType: "jsonp",
            jsonpCallback: "jsonpcallback",
            timeout: 5000,
            type: "GET",
            success: function (data) {
                $('.loadspan').hide();
                haslock = false;
                if (data && data.data && data.data.length > 0) {
                    var plateArray = data.data;
                    for (var i = 0; i < plateArray.length; i++) {
                        var stocklist = plateArray[i].stockslist;
                        if (stocklist && stocklist.length > 0) {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name,  plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', stocklist[0].windcode, stocklist[0].name));
                        } else {
                            _this.plateVM.items.push(new Plate(plateArray[i].windcode, plateArray[i].name, plateArray[i].pct.toFixed(2), (plateArray[i].cap / 100000000).toFixed(2) + '亿', '', ''));
                        }
                    }
                } else if (data && data.data && data.data.length == 0) {
                    $('.loadspan').hide();
                    $(window).unbind('scroll');
                    $('.nomore').show();
                    $('#boardCount').text(_this.plateVM.items().length+'个');
                }
                if (pageNumber == 2) {
                    _this.getAnticipationPlateData();
                }
            }
         }).error(function () {
             $('.loadspan').hide();
             haslock = false;
         });
    };
    _this.getPageData = function (plateType) {
        $('.loadspan').show();
        switch (plateType) {
            case 'recommend': _this.getRecommendPlateData(); break;
            case 'strong': _this.getStrongPlateData(); break;
            case 'anticipation': _this.getAnticipationPlateData(); break;
        }
    }
    //==============上拉加载核心代码=============  
    var winH = $(window).height(); //页面可视区域高度   
    var scrollHandler = function () {
        var pageH = $(document.body).height();
        var scrollT = $(window).scrollTop(); //滚动条top   
        var aa = (pageH - winH - scrollT) / winH;
        if (aa < 0.02) {//0.02是个参数  
            if (!haslock) {
                _this.getPageData(plateType);
            }
        }
    }
    //==============上拉加载核心代码=============  
}



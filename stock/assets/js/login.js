$(function () {
    if (localStorage.token) {
        window.location.href = "../home.html";//已登录会跳转到这个页面
    }
    else {
        var accountManagement = new AccountManagement();
        accountManagement.init();
    }
})
function initValidation() {
    if ($.AMUI && $.AMUI.validator) {
        $.AMUI.validator.patterns.mobile = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
        $.AMUI.validator.patterns.nickname = /^[0-9a-zA-Z\u4e00-\u9fa5_]{1,8}$/;
        $.AMUI.validator.patterns.password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        $.AMUI.validator.patterns.vcode = /^\d{4}$/;
    }
}
initValidation();
var AccountManagement = function () {
    var _this = this;
    var ViewModel = function () {
        var _vm = this;
        _vm.isRegister = ko.observable(false);
        _vm.registerClick = function () {
            _vm.isRegister(true);
        };
        _vm.loginClick = function () {
            _vm.isRegister(false);
        };
        _vm.registerVM = {
            nickName: ko.observable(''),
            password: ko.observable(''),
            username: ko.observable(''),
            verificationCode: ko.observable(''),
            canVerify: ko.observable(false),
            canRegister: ko.observable(false),
            verificationClick: function () {
                var phoneNumber = this.username();
                $('#my-confirm').modal({
                    onConfirm: function (options) {
                        $.ajax({
                            url: "/ihanzhendata/user/" + phoneNumber + "/sendsms",
                            type: "Get",
                            context: null,
                            success: function (data) {

                            }
                        });
                    },
                    onCancel: function () {
                    }
                });
            },
            registerSubmitClick: function () {
                if (this.nickName() && this.password() && this.username() && this.verificationCode() && !$('#register-form input').hasClass('am-field-error')) {
                    var registerInfo = {
                        nickName: _vm.registerVM.nickName().trim(),
                        passWord: _vm.registerVM.password().trim(),
                        vcode: _vm.registerVM.verificationCode().trim()
                    }
                    $.ajax({
                        url: "/ihanzhendata/user/" + registerInfo.loginName + "/regist",
                        type: "Post",
                        data: registerInfo,
                        dataType: 'json',
                        context: null,
                        success: function (data) {
                            window.location.href = "login.html";
                        }
                    });
                }
            }
        };
        _vm.loginVM = {
            username: ko.observable(''),
            password: ko.observable(''),
            canLogin: ko.observable(false),
            loginSubmitClick: function () {
                var loginName = this.username().trim(), passWord = this.password().trim();
                if (loginName && passWord && !$('#login-form input').hasClass('am-field-error')) {
                    console.log("can login");
                    var loginInfo = {
                        loginName: loginName,
                        passWord: passWord
                    }
                    $.ajax({
                        url: "/ihanzhendata/user/login",
                        type: "Post",
                        data: loginInfo,
                        dataType: 'json',
                        context: null,
                        success: function (data) {
                            //localStorage.token = "";
                            window.location.href = "usercenter.html";//登陆成功后跳转到这个页面
                        }
                    });
                }
                else {
                    console.log("can't login");
                }
            }
        };
        _vm.loginVM.password.subscribe(function (newValue) {
            var pRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            if (pRegex.test(newValue.trim())) {
                _vm.loginVM.canLogin(true);
            }
            else {
                _vm.loginVM.canLogin(false);
            }
        });
        _vm.registerVM.username.subscribe(function (newValue) {
            var pRegex = /^1((3|5|8){1}\d{1}|70|77|71)\d{8}$/;
            if (pRegex.test(newValue.trim())) {
                _vm.registerVM.canVerify(true);
            }
            else {
                _vm.registerVM.canVerify(false);
            }
        });
        _vm.registerVM.verificationCode.subscribe(function (newValue) {
            var pRegex = /^\d{4}$/;
            if (pRegex.test(newValue.trim())) {
                _vm.registerVM.canRegister(true);
            }
            else {
                _vm.registerVM.canRegister(false);
            }
        });
    };

    _this.init = function () {
        _this.viewModel = new ViewModel();
        ko.applyBindings(_this.viewModel, $('#account-container')[0]);
    };

    //背景
    (function () {
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        })();

        var can = document.getElementById("canvas"),
            ctx = can.getContext("2d"),
            cw = window.innerWidth,
            ch = 100,
            fireworks = [],//烟花线条集合
            particles = [],//烟花粒子集合
            hue = 120,//初始色调
            limiterTotal = 5,//点击产生烟花的时间间隔
            limiterTick = 0,//点击的初始时间
            timerTotal = 80,//自动产生烟花的时间间隔
            timerTick = 0,
            mousedown = false,
            mx, my;
        can.width = cw;
        can.height = ch;

        //勾股定理计算烟花线条移动的距离
        function calculateDistance(x1, y1, x2, y2) {
            var xDistance = x1 - x2,
                yDistance = y1 - y2;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }
        //生成一个随机数
        function random(min, max) {
            return Math.random() * (max - min) + min
        }
        //烟花线条
        function Firework(sx, sy, tx, ty) {
            this.x = sx;//新的坐标位置赋值给开始坐标
            this.y = sy;
            this.sx = sx;//开始坐标
            this.sy = sy;
            this.tx = tx;//目标位置
            this.ty = ty;
            this.distanceTotarget = calculateDistance(sx, sy, tx, ty);//总的距离
            this.distanceTraveled = 0;//当前所移动的距离
            this.coordinates = [];//坐标点集合
            this.coordinateCount = 3;//坐标点个数
            while (this.coordinateCount--)//添加坐标点到数组
            {
                this.coordinates.push([this.x, this.y]);
            }

            this.angle = Math.atan2(ty - sy, tx - sx);//计算烟花移动轨迹和x轴的角度
            this.speed = 2;//开始速度
            this.acceleration = 1.05;//加速度
            this.brightness = random(50, 70);//烟花颜色的亮度
            this.targetRadius = 1;//到达目标位置产生一个半径为1的圆
        }
        //添加烟花线条的功能
        Firework.prototype.update = function (i) {//更新坐标
            this.coordinates.pop();//移除最后一个坐标点
            this.coordinates.unshift([this.x, this.y]);//把最新的坐标点添加到数组最前面
            this.speed *= this.acceleration;//有加速度的速度值
            var vx = Math.cos(this.angle) * this.speed;//x方向的速度
            var vy = Math.sin(this.angle) * this.speed;//y方向的速度
            this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
            //当烟花线条到达终点的时候就消失
            if (this.distanceTraveled >= this.distanceTotarget) {
                //添加烟花粒子
                fireworks.splice(i, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
            //目标位置提示圆形的半径
            if (this.targetRadius < 8) {
                this.targetRadius += 0.3;
            } else {
                this.targetRadius = 1;
            }
        }
        //绘制出烟花线条
        Firework.prototype.draw = function () {
            //绘制烟花线条
            ctx.beginPath();
            //从坐标数组里面的最后一个坐标绘制到最新的坐标位置
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();
            ctx.strokeStyle = "hsl(" + hue + ",100%," + this.brightness + "%)";
            ctx.stroke();
            //绘制目标点的提示圆
            ctx.beginPath();
            ctx.arc(this.tx, this.ty, this.targetRadius, 0, 360, false);
            ctx.stroke();
        }

        //整个动画
        function loop() {//循环产生烟花
            requestAnimFrame(loop);//每16.7ms请求加载一次loop
            hue += 0.5;
            ctx.globalCompositeOperation = "destination-out";//源图像透明
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(0, 0, cw, ch);
            ctx.globalCompositeOperation = "lighter";//显示叠加部分
            var i = fireworks.length;
            //绘制具体的每个烟花对象
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }
            //鼠标点击产生烟花
            if (limiterTick >= limiterTotal) {
                if (mousedown) {//添加新的烟花对象到烟花线条数组集合
                    fireworks.push(new Firework(cw / 2, ch, mx, my));
                    limiterTick = 0;
                }
            } else {
                limiterTick++;
            }
            //自动产生烟花
            if (timerTick >= timerTotal) {
                if (!mousedown)//判断是不是鼠标点击
                {
                    fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
                    timerTick = 0;
                }
            } else {
                timerTick++;
            }
        }

        window.onload = loop;
    }());
}

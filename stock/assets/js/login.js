$(function () {
    if (localStorage.token) {
        window.location.href = "../home.html";//�ѵ�¼����ת�����ҳ��
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
                            window.location.href = "usercenter.html";//��½�ɹ�����ת�����ҳ��
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

    //����
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
            fireworks = [],//�̻���������
            particles = [],//�̻����Ӽ���
            hue = 120,//��ʼɫ��
            limiterTotal = 5,//��������̻���ʱ����
            limiterTick = 0,//����ĳ�ʼʱ��
            timerTotal = 80,//�Զ������̻���ʱ����
            timerTick = 0,
            mousedown = false,
            mx, my;
        can.width = cw;
        can.height = ch;

        //���ɶ�������̻������ƶ��ľ���
        function calculateDistance(x1, y1, x2, y2) {
            var xDistance = x1 - x2,
                yDistance = y1 - y2;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }
        //����һ�������
        function random(min, max) {
            return Math.random() * (max - min) + min
        }
        //�̻�����
        function Firework(sx, sy, tx, ty) {
            this.x = sx;//�µ�����λ�ø�ֵ����ʼ����
            this.y = sy;
            this.sx = sx;//��ʼ����
            this.sy = sy;
            this.tx = tx;//Ŀ��λ��
            this.ty = ty;
            this.distanceTotarget = calculateDistance(sx, sy, tx, ty);//�ܵľ���
            this.distanceTraveled = 0;//��ǰ���ƶ��ľ���
            this.coordinates = [];//����㼯��
            this.coordinateCount = 3;//��������
            while (this.coordinateCount--)//�������㵽����
            {
                this.coordinates.push([this.x, this.y]);
            }

            this.angle = Math.atan2(ty - sy, tx - sx);//�����̻��ƶ��켣��x��ĽǶ�
            this.speed = 2;//��ʼ�ٶ�
            this.acceleration = 1.05;//���ٶ�
            this.brightness = random(50, 70);//�̻���ɫ������
            this.targetRadius = 1;//����Ŀ��λ�ò���һ���뾶Ϊ1��Բ
        }
        //����̻������Ĺ���
        Firework.prototype.update = function (i) {//��������
            this.coordinates.pop();//�Ƴ����һ�������
            this.coordinates.unshift([this.x, this.y]);//�����µ��������ӵ�������ǰ��
            this.speed *= this.acceleration;//�м��ٶȵ��ٶ�ֵ
            var vx = Math.cos(this.angle) * this.speed;//x������ٶ�
            var vy = Math.sin(this.angle) * this.speed;//y������ٶ�
            this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
            //���̻����������յ��ʱ�����ʧ
            if (this.distanceTraveled >= this.distanceTotarget) {
                //����̻�����
                fireworks.splice(i, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
            //Ŀ��λ����ʾԲ�εİ뾶
            if (this.targetRadius < 8) {
                this.targetRadius += 0.3;
            } else {
                this.targetRadius = 1;
            }
        }
        //���Ƴ��̻�����
        Firework.prototype.draw = function () {
            //�����̻�����
            ctx.beginPath();
            //������������������һ��������Ƶ����µ�����λ��
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();
            ctx.strokeStyle = "hsl(" + hue + ",100%," + this.brightness + "%)";
            ctx.stroke();
            //����Ŀ������ʾԲ
            ctx.beginPath();
            ctx.arc(this.tx, this.ty, this.targetRadius, 0, 360, false);
            ctx.stroke();
        }

        //��������
        function loop() {//ѭ�������̻�
            requestAnimFrame(loop);//ÿ16.7ms�������һ��loop
            hue += 0.5;
            ctx.globalCompositeOperation = "destination-out";//Դͼ��͸��
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(0, 0, cw, ch);
            ctx.globalCompositeOperation = "lighter";//��ʾ���Ӳ���
            var i = fireworks.length;
            //���ƾ����ÿ���̻�����
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }
            //����������̻�
            if (limiterTick >= limiterTotal) {
                if (mousedown) {//����µ��̻������̻��������鼯��
                    fireworks.push(new Firework(cw / 2, ch, mx, my));
                    limiterTick = 0;
                }
            } else {
                limiterTick++;
            }
            //�Զ������̻�
            if (timerTick >= timerTotal) {
                if (!mousedown)//�ж��ǲ��������
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

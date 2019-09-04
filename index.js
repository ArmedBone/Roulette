"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CuteLine = function () {
    function CuteLine(x, y, width, height, dr) {
        _classCallCheck(this, CuteLine);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dr = dr;
    }

    _createClass(CuteLine, [{
        key: "draw",
        value: function draw(ctx, fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(this.x, this.y - 2, this.width, this.height);
        }
    }]);

    return CuteLine;
}();

var CuteDot = function () {
    function CuteDot(x, y, r) {
        _classCallCheck(this, CuteDot);

        this.x = x;
        this.y = y;
        this.r = r;
    }

    _createClass(CuteDot, [{
        key: "draw",
        value: function draw(ctx, fillColor) {
            ctx.fillStyle = fillColor;
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        }
    }]);

    return CuteDot;
}();

var CuteText = {
    draw: function draw(ctx, value, size, fillColor, x0, y0) {
        ctx.fillStyle = fillColor;
        ctx.font = "normal " + size + "px Verdana";
        ctx.fillText(value, x0 - 20, y0);
    }
};

var Stage = function () {
    function Stage(canvasDom) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 160;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 160;

        _classCallCheck(this, Stage);

        this.canvasDom = canvasDom;
        this.canvasDom.width = width;
        this.canvasDom.height = height;
        this.context = this.canvasDom.getContext('2d');
        this.stackSize = 0;
    }

    _createClass(Stage, [{
        key: "create",
        value: function create(Roule, value) {
            var self = this;
            this.context.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
            Roule.items.forEach(function (item) {
                self.render(item, 0, 'silver');
            });
            this.setLabel();
            this.setPercent(Roule, value);
        }
    }, {
        key: "setLabel",
        value: function setLabel() {
            var ctx = this.context,
                self = this;
            ctx.beginPath();
            ctx.fillStyle = "silver";
            ctx.font = "normal 20px Verdana";
            ctx.fillText("好评率", this.canvasDom.width / 2 - 30, this.canvasDom.height / 2);
            ctx.fill();
        }
    }, {
        key: "Linear",
        value: function Linear(t, b, c, d) {
            return c * t / d + b;
        }
    }, {
        key: "setPercent",
        value: function setPercent(Roule, value) {
            this.stackSize = Roule.items.length;
            var max = value / 100 * this.stackSize,
                index = 0,
                self = this,
                value = 0;
            this.ticker(function () {
                var item = Roule.items[Math.floor(value)];
                self.render(item, value, 'blue');
                if (index < self.stackSize) {
                    index += 1;
                    value = index / self.stackSize * max;
                    return true;
                } else {
                    return false;
                }
            });
        }
    }, {
        key: "render",
        value: function render(item, value, fillColor) {

            var rad = item.get('rad');
            var ctx = this.context,
                self = this;

            ctx.translate(this.canvasDom.width / 2, this.canvasDom.height / 2);
            ctx.rotate(rad);

            var dot = item.get("dot");
            var rect = item.get("rect");

            ctx.beginPath();
            dot.draw(ctx, fillColor);
            rect.draw(ctx, fillColor);
            ctx.fill();

            ctx.rotate(-rad);
            ctx.translate(-this.canvasDom.width / 2, -this.canvasDom.height / 2);

            this.drawValue(value);
        }
    }, {
        key: "drawValue",
        value: function drawValue(value) {
            value = value * 100 / this.stackSize;
            var ctx = this.context,
                self = this;
            var labelValue = value.toFixed(2) + "%";
            var labelWidth = ctx.measureText(labelValue).width;

            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.fillRect(this.canvasDom.width / 2 - labelWidth / 2, this.canvasDom.height / 2 + 10, labelWidth, 25);
            ctx.fill();
            ctx.beginPath();
            CuteText.draw(ctx, labelValue, 20, 'black', this.canvasDom.width / 2 - labelWidth / 4, this.canvasDom.height / 2 + 30);
            ctx.fill();
        }
    }, {
        key: "ticker",
        value: function ticker(Function) {
            var self = this,
                flag;
            function requestAnimationFrame() {
                flag = Function(self.context);
                setTimeout(function () {
                    if (flag) requestAnimationFrame();
                }, 15);
            }
            requestAnimationFrame();
        }
    }]);

    return Stage;
}();

/*轮盘对象*/


var Index = function () {
    function Index(el) {
        var x0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120;
        var y0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 120;
        var r0 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 80;
        var dr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var rw = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
        var rh = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 2;

        _classCallCheck(this, Index);

        this.el = el;
        this.items = [];
        this.x0 = x0;
        this.y0 = y0;
        this.r0 = r0;
        this.dr = dr;
        this.rw = rw;
        this.rh = rh;
        this.stage = new Stage(el, 2 * x0, 2 * y0);
        this.initStart();
    }

    _createClass(Index, [{
        key: "setValue",
        value: function setValue(num) {
            this.stage.create(this, num);
        }
    }, {
        key: "translateCircle",
        value: function translateCircle(a) {
            var offset = 10;
            var rad = a * Math.PI / 180;
            var x = this.r0;
            var y = 0;
            var rx = this.r0 + offset;
            var ry = 0;
            return {
                "dot": { x: x, y: y },
                "rect": { rx: rx, ry: ry },
                "rad": rad
            };
        }
    }, {
        key: "getCirclePoints",
        value: function getCirclePoints() {
            var points = [];
            for (var i = 150; i <= 390; i += 4) {
                points.push(this.translateCircle(i));
            }
            return points;
        }
    }, {
        key: "initStart",
        value: function initStart() {
            var _this = this;

            var points = this.getCirclePoints();
            points.forEach(function (point) {
                var item = new Map();
                item.set("rad", point.rad);
                item.set("dot", new CuteDot(point["dot"].x, point["dot"].y, _this.dr));
                item.set("rect", new CuteLine(point["rect"].rx, point["rect"].ry, _this.rw, _this.rh));
                _this.items.push(item);
            });
        }
    }]);

    return Index;
}();

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Index;
    }
    exports.Index = Index;
} else {
    window.Roule = Index;
}
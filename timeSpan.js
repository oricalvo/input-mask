"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var common_1 = require("./common");
var InputMaskTimeSpan = (function (_super) {
    __extends(InputMaskTimeSpan, _super);
    function InputMaskTimeSpan(input, options) {
        var _this = _super.call(this, input, "{d}.{hh}:{mm}") || this;
        _this.options = options || {
            allowSign: false
        };
        return _this;
    }
    InputMaskTimeSpan.prototype.validate = function (keyCode, buf, fields) {
        var ch = String.fromCharCode(keyCode);
        if (!common_1.isFunction(keyCode) &&
            !common_1.isDigit(keyCode) &&
            ch != "-" &&
            ch != "+") {
            return false;
        }
        if (!this.options.allowSign && (ch == "-" || ch != "+")) {
            return false;
        }
        var hh = fields.hh.buf;
        if (hh[0] && hh[1]) {
            var num = parseInt(hh[0] + hh[1]);
            if (isNaN(num) || num < 0 || num > 23) {
                return false;
            }
        }
        var mm = fields.mm.buf;
        if (mm[0] && mm[1]) {
            var num = parseInt(mm[0] + mm[1]);
            if (isNaN(num) || num < 0 || num > 59) {
                return false;
            }
        }
        return true;
    };
    return InputMaskTimeSpan;
}(base_1.InputMaskBase));
exports.InputMaskTimeSpan = InputMaskTimeSpan;

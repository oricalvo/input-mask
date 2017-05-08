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
    function InputMaskTimeSpan(input) {
        return _super.call(this, input, "{d}.{hh}:{mm}") || this;
    }
    InputMaskTimeSpan.prototype.validate = function (ch, value, fields) {
        if (!common_1.isDigitKeyCode(ch.charCodeAt(0))) {
            return false;
        }
        var hh = fields.hh.value;
        if (hh[0] != "h" && hh[1] != "h") {
            var num = parseInt(hh.value);
            if (isNaN(num) || num < 0 || num > 23) {
                return false;
            }
        }
        var mm = fields.mm.value;
        if (mm[0] != "m" && mm[1] != "m") {
            var num = parseInt(mm.value);
            if (isNaN(num) || num < 0 || num > 59) {
                return false;
            }
        }
        return true;
    };
    return InputMaskTimeSpan;
}(base_1.InputMaskBase));
exports.InputMaskTimeSpan = InputMaskTimeSpan;

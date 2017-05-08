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
var InputMaskDate = (function (_super) {
    __extends(InputMaskDate, _super);
    function InputMaskDate(input) {
        return _super.call(this, input, "{dd}/{mm}/{yyyy}") || this;
    }
    InputMaskDate.prototype.validate = function (ch, value, fields) {
        if (!common_1.isDigitKeyCode(ch.charCodeAt(0))) {
            return false;
        }
        var completed = 0;
        var dd = fields.dd.value;
        if (dd[0] != "d" && dd[1] != "d") {
            ++completed;
            var day = parseInt(dd);
            if (isNaN(day) || day < 1 || day > 31) {
                return false;
            }
        }
        var mm = fields.mm.value;
        if (mm[0] != "m" && mm[1] != "m") {
            ++completed;
            var month = parseInt(mm[0] + mm[1]);
            if (isNaN(month) || month < 1 || month > 12) {
                return false;
            }
        }
        var yyyy = fields.yyyy.value;
        if (yyyy[0] != "y" && yyyy[1] != "y" && yyyy[2] != "y" && yyyy[3] != "y") {
            ++completed;
            var year = parseInt(yyyy);
            if (isNaN(year) || year < 1900 || year > 2200) {
                return false;
            }
        }
        if (completed == 3 && !common_1.isValidDate(day, month, year)) {
            this.input.classList.add("invalid");
        }
        else {
            this.input.classList.remove("invalid");
        }
        return true;
    };
    return InputMaskDate;
}(base_1.InputMaskBase));
exports.InputMaskDate = InputMaskDate;

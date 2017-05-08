(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.inputMask = global.inputMask || {})));
}(this, (function (exports) { 'use strict';

var KEY_0 = "0".charCodeAt(0);
var KEY_9 = "9".charCodeAt(0);
var KEY_RIGHT = 39;
var KEY_LEFT = 37;
var KEY_BACKSPACE = 8;
function isDigit(keyCode) {
    return (keyCode >= KEY_0 && keyCode <= KEY_9);
}
function isFunction(keyCode) {
    return keyCode == KEY_BACKSPACE || keyCode == KEY_LEFT || keyCode == KEY_RIGHT;
}
function isValidDate(day, month, year) {
    var date = new Date(year, month - 1, day);
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    if (year != y || month - 1 != m || day != d) {
        return false;
    }
    return true;
}
function parsePattern(pattern) {
    var fields = {};
    var startFrom = 0;
    var fix = 0;
    var buf = [];
    if (pattern) {
        while (startFrom < pattern.length) {
            var begin = pattern.indexOf("{", startFrom);
            if (begin == -1) {
                break;
            }
            var end = pattern.indexOf("}", begin + 1);
            if (end == -1 || end == begin + 1) {
                throw new Error("Invalid pattern " + pattern);
            }
            for (var i = startFrom; i < begin; i++) {
                buf.push(pattern[i]);
            }
            for (var i = 0; i < end - begin - 1; i++) {
                buf.push(undefined);
            }
            var name = pattern.substring(begin + 1, end);
            var field = {
                name: name,
                buf: [],
                full: false,
                chs: 0,
                begin: begin - fix,
                end: end - 1 - fix,
            };
            if (fields.hasOwnProperty(field.name)) {
                throw new Error("Found two fields field with the same name: " + field.name);
            }
            fields[field.name] = field;
            fix += 2;
            startFrom = end + 1;
        }
        pattern = pattern.replace(new RegExp("{|}", "g"), "");
    }
    return {
        buf: buf,
        pattern: pattern,
        fields: fields,
    };
}
function cloneBuf(buf, pos, ch) {
    var clone = buf.concat([]);
    clone[pos] = ch;
    return clone;
}
function cloneField(field, pos, ch) {
    var clone = Object.assign({}, field, {
        buf: cloneBuf(field.buf, pos, ch),
    });
    clone[pos] = ch;
    return clone;
}
function cloneFields(fields, pos, ch) {
    var field = findFieldByPos(fields, pos);
    if (field) {
        field = cloneField(field, pos - field.begin, ch);
        fields = Object.assign({}, fields, (_a = {},
            _a[field.name] = field,
            _a));
    }
    return fields;
    var _a;
}
function findFieldByPos(fields, pos) {
    for (var key in fields) {
        var field = fields[key];
        if (pos >= field.begin && pos < field.end) {
            return field;
        }
    }
    return null;
}
//# sourceMappingURL=common.js.map

var InputMaskBase = (function () {
    function InputMaskBase(input, pattern, options) {
        this.input = input;
        this.pos = 0;
        this.options = options || {};
        var info = parsePattern(pattern);
        this.pattern = info.pattern;
        this.max_pos = this.pattern && this.pattern.length;
        this.fields = info.fields;
        this.buf = info.buf;
        this.input.value = this.pattern;
        this.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.input.addEventListener("keypress", this.onKeyPress.bind(this));
        this.input.addEventListener("focus", this.onFocus.bind(this));
    }
    InputMaskBase.prototype.isSeperator = function (pos) {
        for (var key in this.fields) {
            var field = this.fields[key];
            if (pos >= field.begin && pos < field.end) {
                return false;
            }
        }
        return true;
    };
    InputMaskBase.prototype.onKeyDown = function (e) {
        var _this = this;
        var cmd = null;
        var newBuf = null;
        var newFields = null;
        if (e.which == KEY_RIGHT) {
            cmd = this.next;
        }
        else if (e.which == KEY_LEFT) {
            cmd = this.prev;
        }
        else if (e.which == KEY_BACKSPACE) {
            newBuf = cloneBuf(this.buf, this.pos, undefined);
            newFields = cloneFields(this.fields, this.pos, undefined);
            cmd = this.prev;
        }
        if (cmd || newBuf) {
            e.preventDefault();
            setTimeout(function () {
                if (newBuf) {
                    //
                    //  Call validate and ignore return value
                    //  We allow backspace for invalid value
                    //  We still need to call "validate" since it may change the input apearance (CSS)
                    //
                    _this.validate(e.which, newBuf, newFields);
                    _this.update(newBuf, newFields);
                }
                if (cmd) {
                    cmd.call(_this);
                }
            }, 0);
        }
    };
    InputMaskBase.prototype.canType = function (pos) {
        if (this.pattern && this.pos == this.max_pos) {
            return false;
        }
        return true;
    };
    InputMaskBase.prototype.onKeyPress = function (e) {
        var _this = this;
        if (!this.canType(this.pos)) {
            e.preventDefault();
            return;
        }
        var ch = String.fromCharCode(e.which);
        var newBuf = cloneBuf(this.buf, this.pos, ch);
        var newFields = cloneFields(this.fields, this.pos, ch);
        e.preventDefault();
        if (this.validate(ch.charCodeAt(0), newBuf, newFields)) {
            setTimeout(function () {
                _this.update(newBuf, newFields);
                _this.next();
            }, 0);
        }
    };
    InputMaskBase.prototype.onFocus = function (e) {
        var _this = this;
        setTimeout(function () {
            _this.setSelection();
        }, 0);
    };
    InputMaskBase.prototype.update = function (newBuf, fields) {
        var oldBuf = this.buf;
        var value = newBuf.concat();
        for (var i = 0; i < value.length; i++) {
            if (!value[i]) {
                value[i] = this.pattern[i];
            }
        }
        this.input.value = value.join("");
        this.buf = newBuf;
        this.fields = fields;
    };
    InputMaskBase.prototype.setSelection = function () {
        if (this.pos == this.max_pos) {
            this.input.setSelectionRange(this.max_pos, this.max_pos);
        }
        else {
            this.input.setSelectionRange(this.pos, this.pos + 1);
        }
    };
    InputMaskBase.prototype.next = function () {
        if (this.pos < this.max_pos) {
            while (this.isSeperator(++this.pos)) {
                if (this.pos == this.max_pos) {
                    break;
                }
            }
        }
        this.setSelection();
    };
    InputMaskBase.prototype.prev = function () {
        if (this.pos > 0) {
            while (this.isSeperator(--this.pos)) {
                if (this.pos == -1) {
                    this.pos = 0;
                    break;
                }
            }
        }
        this.setSelection();
    };
    InputMaskBase.prototype.onChanged = function () {
    };
    InputMaskBase.prototype.clearInvalidIndication = function () {
        this.input.classList.remove("invalid");
    };
    InputMaskBase.prototype.setInvalidIndication = function () {
        this.input.classList.add("invalid");
    };
    return InputMaskBase;
}());

//# sourceMappingURL=base.js.map

var InputMaskTime = (function (_super) {
    __extends(InputMaskTime, _super);
    function InputMaskTime(input) {
        return _super.call(this, input, "{hh}:{mm}") || this;
    }
    InputMaskTime.prototype.validate = function (keyCode, buf, fields) {
        if (!isFunction(keyCode) && !isDigit(keyCode)) {
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
    return InputMaskTime;
}(InputMaskBase));

//# sourceMappingURL=time.js.map

var InputMaskDate = (function (_super) {
    __extends(InputMaskDate, _super);
    function InputMaskDate(input, options) {
        return _super.call(this, input, "{dd}/{mm}/{yyyy}", options) || this;
    }
    InputMaskDate.prototype.validate = function (keyCode, buf, fields) {
        if (!isFunction(keyCode) && !isDigit(keyCode)) {
            return false;
        }
        this.clearInvalidIndication();
        var completed = 0;
        var dd = fields.dd.buf;
        if (dd[0] && dd[1]) {
            ++completed;
            var day = parseInt(dd[0] + dd[1]);
            if (isNaN(day) || day < 1 || day > 31) {
                return false;
            }
        }
        var mm = fields.mm.buf;
        if (mm[0] && mm[1]) {
            ++completed;
            var month = parseInt(mm[0] + mm[1]);
            if (isNaN(month) || month < 1 || month > 12) {
                return false;
            }
        }
        var yyyy = fields.yyyy.buf;
        if (yyyy[0] && yyyy[1] && yyyy[2] && yyyy[3]) {
            ++completed;
            var year = parseInt(yyyy.join(""));
            if (isNaN(year) || year < 1900 || year > 2200) {
                return false;
            }
        }
        if (completed == 3 && !isValidDate(day, month, year)) {
            this.setInvalidIndication();
        }
        return true;
    };
    return InputMaskDate;
}(InputMaskBase));

//# sourceMappingURL=date.js.map

var InputMaskTimeSpan = (function (_super) {
    __extends(InputMaskTimeSpan, _super);
    function InputMaskTimeSpan(input) {
        return _super.call(this, input, "{d}.{hh}:{mm}") || this;
    }
    InputMaskTimeSpan.prototype.validate = function (keyCode, buf, fields) {
        if (!isFunction(keyCode) && !isDigit(keyCode)) {
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
}(InputMaskBase));

//# sourceMappingURL=timeSpan.js.map

function inputMaskNumber(input, options) {
    options = options || {};
    function validate(ch, buf, value) {
        console.log("VALIDATE");
        if (options.noDot && ch == ".") {
            return false;
        }
        if (value == "+" || value == "-") {
            return true;
        }
        var num = Number(value);
        if (isNaN(num)) {
            return false;
        }
        return true;
    }
    function clearInvalidIndication() {
        input.classList.remove("invalid");
    }
    function setInvalidIndication() {
        input.classList.add("invalid");
    }
    function resetIndication(value) {
        clearInvalidIndication();
        if (value === "") {
            return;
        }
        var num = Number(value);
        if (isNaN(num)) {
            return;
        }
        if (options && options.hasOwnProperty("min") && num < options.min) {
            setInvalidIndication();
        }
        if (options && options.hasOwnProperty("max") && num > options.max) {
            setInvalidIndication();
        }
    }
    input.addEventListener("keydown", function (e) {
        console.log("DOWN");
        setTimeout(function () {
            resetIndication(input.value);
        }, 0);
    });
    input.addEventListener("keypress", function (e) {
        console.log("UP");
        var ch = String.fromCharCode(e.which);
        var buf = input.value.split("");
        buf.splice(input.selectionStart, 0, ch);
        var value = buf.join("");
        if (!validate(ch, buf, value)) {
            e.preventDefault();
        }
    });
}
//# sourceMappingURL=number.js.map

function inputMaskDouble(input, options) {
    inputMaskNumber(input, options);
}

function inputMaskInteger(input, options) {
    options = options || {};
    options.noDot = true;
    inputMaskNumber(input, options);
}
//# sourceMappingURL=integer.js.map

function create(type, element, options) {
    if (type == "time") {
        new InputMaskTime(element);
    }
    else if (type == "date") {
        new InputMaskDate(element);
    }
    else if (type == "timeSpan") {
        new InputMaskTimeSpan(element);
    }
    else if (type == "integer") {
        inputMaskInteger(element, options);
    }
    else if (type == "double") {
        inputMaskDouble(element);
    }
    else {
        throw new Error("Unknown inputMask type: " + type);
    }
}
//# sourceMappingURL=index.js.map

exports.create = create;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=input-mask.umd.js.map

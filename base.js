"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var InputMaskBase = (function () {
    function InputMaskBase(input, pattern, options) {
        this.input = input;
        this.pos = 0;
        this.options = options || {};
        var info = common_1.parsePattern(pattern);
        this.pattern = info.pattern;
        this.max_pos = this.pattern && this.pattern.length;
        this.fields = info.fields;
        this.buf = info.buf;
        this.input.value = this.pattern;
        this.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.input.addEventListener("keypress", this.onKeyPress.bind(this));
        this.input.addEventListener("focus", this.onFocus.bind(this));
        this.input.addEventListener("mousedown", this.onMouseDown.bind(this));
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
        console.log(e.which);
        var cmd = null;
        var newBuf = null;
        var newFields = null;
        if (e.which == common_1.KEY_RIGHT) {
            cmd = this.next;
        }
        else if (e.which == common_1.KEY_LEFT) {
            cmd = this.prev;
        }
        else if (e.which == common_1.KEY_BACKSPACE) {
            newBuf = common_1.cloneBuf(this.buf, this.pos, undefined);
            newFields = common_1.cloneFields(this.fields, this.pos, undefined);
            cmd = this.prev;
        }
        else if (e.which == common_1.KEY_DELETE) {
            e.preventDefault();
            return;
        }
        else if (e.which == common_1.KEY_DOWN) {
            e.preventDefault();
            return;
        }
        else if (e.which == common_1.KEY_UP) {
            e.preventDefault();
            return;
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
        var newBuf = common_1.cloneBuf(this.buf, this.pos, ch);
        var newFields = common_1.cloneFields(this.fields, this.pos, ch);
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
    InputMaskBase.prototype.onMouseDown = function (e) {
        var _this = this;
        e.preventDefault();
        e.target.focus();
        setTimeout(function () {
            _this.setSelection();
        }, 0);
    };
    return InputMaskBase;
}());
exports.InputMaskBase = InputMaskBase;

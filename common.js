"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_0 = "0".charCodeAt(0);
exports.KEY_9 = "9".charCodeAt(0);
exports.KEY_RIGHT = 39;
exports.KEY_LEFT = 37;
exports.KEY_UP = 38;
exports.KEY_DOWN = 40;
exports.KEY_BACKSPACE = 8;
exports.KEY_DELETE = 46;
function isDigit(keyCode) {
    return (keyCode >= exports.KEY_0 && keyCode <= exports.KEY_9);
}
exports.isDigit = isDigit;
function isFunction(keyCode) {
    return keyCode == exports.KEY_BACKSPACE || keyCode == exports.KEY_LEFT || keyCode == exports.KEY_RIGHT;
}
exports.isFunction = isFunction;
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
exports.isValidDate = isValidDate;
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
exports.parsePattern = parsePattern;
function cloneBuf(buf, pos, ch) {
    var clone = buf.concat([]);
    clone[pos] = ch;
    return clone;
}
exports.cloneBuf = cloneBuf;
function cloneField(field, pos, ch) {
    var clone = Object.assign({}, field, {
        buf: cloneBuf(field.buf, pos, ch),
    });
    clone[pos] = ch;
    return clone;
}
exports.cloneField = cloneField;
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
exports.cloneFields = cloneFields;
function findFieldByPos(fields, pos) {
    for (var key in fields) {
        var field = fields[key];
        if (pos >= field.begin && pos < field.end) {
            return field;
        }
    }
    return null;
}
exports.findFieldByPos = findFieldByPos;

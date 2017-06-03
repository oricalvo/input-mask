import {TimeSpanOptions} from "./timeSpan";
export const KEY_0 = "0".charCodeAt(0);
export const KEY_9 = "9".charCodeAt(0);
export const KEY_RIGHT = 39;
export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_DOWN = 40;
export const KEY_BACKSPACE = 8;
export const KEY_DELETE = 46;

export function isDigit(keyCode: number) {
    return (keyCode >= KEY_0 && keyCode <= KEY_9);
}

export function isSign(keyCode: number) {
    const ch = String.fromCharCode(keyCode);
    return ch == "+" || ch == "-";
}

export function isFunction(keyCode: number) {
    return keyCode == KEY_BACKSPACE || keyCode == KEY_LEFT || keyCode == KEY_RIGHT;
}

export function isValidDate(day, month, year) {
    var date = new Date(year, month-1, day);

    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    if(year!=y || month-1!=m || day!=d) {
        return false;
    }

    return true;
}

export interface FieldOptions {
    defValue?: string;
}

export type FieldsOptions = {[key: string]: FieldOptions};

export interface Field {
    name: string;
    buf: any[];
    full: boolean;
    chs: number;
    begin: number;
    end: number;
    len: number;
    options: FieldOptions;
}

export type Fields = {[key: string]: Field};

export function parsePattern(pattern) {
    const fields: Fields = {};
    let startFrom = 0;
    let fix = 0;
    let buf = [];

    if(pattern) {
        while (startFrom < pattern.length) {
            var begin = pattern.indexOf("{", startFrom);
            if (begin == -1) {
                break;
            }

            var end = pattern.indexOf("}", begin + 1)
            if (end == -1 || end == begin + 1) {
                throw new Error("Invalid pattern " + pattern);
            }

            for (let i = startFrom; i < begin; i++) {
                buf.push(pattern[i]);
            }

            for (let i = 0; i < end - begin - 1; i++) {
                buf.push(undefined);
            }

            var name = pattern.substring(begin + 1, end);
            const b = begin - fix;
            const e = end - 1 - fix;
            const len = e - b;
            var field: Field = {
                name: name,
                buf: [],
                full: false,
                chs: 0,
                begin: b,
                end: e,
                len: len,
                options: null,
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
    }
}

export function cloneBuf(buf: string[], pos: number, ch: string) {
    const clone = buf.concat([]);
    if(pos!==undefined) {
        clone[pos] = ch;
    }
    return clone;
}

export function cloneField(field: Field, pos: number, ch: string) {
    const clone = Object.assign({}, field, {
        buf: cloneBuf(field.buf, pos, ch),
    });

    clone[pos] = ch;

    return clone;
}

export function cloneFields(fields: Fields) {
    const newFields: Fields = {};

    for(let key in fields) {
        const field = fields[key];
        newFields[key] = cloneField(field, undefined, undefined);
    }

    return newFields;
}

export function cloneFieldsByPos(fields: Fields, pos: number, ch: string) {
    let field = findFieldByPos(fields, pos);
    if(field) {
        field = cloneField(field, pos - field.begin, ch)

        fields = Object.assign({}, fields, {
            [field.name]: field,
        })
    }

    return fields;
}

export function findFieldByPos(fields: Fields, pos: number) {
    for(let key in fields) {
        const field = fields[key];
        if(pos >= field.begin  && pos < field.end) {
            return field;
        }
    }

    return null;
}

export function validateTimeSpanRange(value: string, options: TimeSpanOptions) {
    if(options.min && value < options.min) {
        return false;
    }

    if(options.max && value > options.max) {
        return false;
    }

    return true
}

export function copyArray(source, begin, end, dest, destBegin) {
    for(let i=begin; i<end; i++) {
        dest[destBegin+i-begin] = source[i];
    }
}
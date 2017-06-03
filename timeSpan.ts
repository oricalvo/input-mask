import {InputMaskBase} from "./base";
import {cloneFields, Fields, isDigit, isFunction} from "./common";

export interface TimeSpanOptions {
    min?: string;
    max?: string;
}

export class InputMaskTimeSpan extends InputMaskBase {
    options: TimeSpanOptions;

    constructor(input, options?: TimeSpanOptions) {
        super(input, "{d}.{hh}:{mm}");

        this.options = options || {};
    }

    setValue(days: number, hours: number, minutes: number) {
        const newFields = cloneFields(this.fields);

        newFields.d.buf = (days % 10).toString().split("");
        newFields.hh.buf = (Math.floor(hours / 10).toString() + (hours % 10).toString()).split("");
        newFields.mm.buf = (Math.floor(minutes / 10).toString() + (minutes % 10).toString()).split("");

        this.updateByFields(newFields);
    }

    getValue() {
        const days = parseInt(this.fields.d.buf.join(""));
        if(isNaN(days)) {
            return undefined;
        }

        const hours = parseInt(this.fields.hh.buf.join(""));
        if(isNaN(hours)) {
            return undefined;
        }

        const minutes = parseInt(this.fields.mm.buf.join(""));
        if(isNaN(minutes)) {
            return undefined;
        }

        return {days, hours, minutes};
    }

    validateKey(keyCode: number) {
        var ch = String.fromCharCode(keyCode);
        if (!isFunction(keyCode) &&
            !isDigit(keyCode) &&
            ch != "-" &&
            ch != "+") {
            return false;
        }

        return true;
    }

    validateBuf(buf: string[], fields: Fields) {
        var mm = fields.mm.buf;
        if (mm[0] && mm[1]) {
            var num = parseInt(mm[0] + mm[1]);
            if (isNaN(num) || num < 0 || num > 59) {
                return false;
            }
        }

        return true;
    }

    checkComplete(buf: string[], fields: Fields) {
        var d = fields.d.buf;
        var hh = fields.hh.buf;
        var mm = fields.mm.buf;

        if (d[0] && hh[0] && hh[1] && mm[0] && mm[1]) {
            return true;
        }

        return false;
    }
}

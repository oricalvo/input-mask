import {InputMaskBase} from "./base";
import {Fields, isDigit, isFunction, isSign, validateTimeSpanRange, cloneFields} from "./common";
import {TimeSpanOptions} from "./timeSpan";

export class InputMaskSignedTimeSpan extends InputMaskBase {
    options: TimeSpanOptions;

    constructor(input, options?: TimeSpanOptions) {
        super(input, "{s}{d}.{hh}:{mm}", {
            "s": {
                defValue: "+",
            }
        });

        this.options = options || {};
    }

    setValue(positive: boolean, days: number, hours: number, minutes: number) {
        const newFields = cloneFields(this.fields);

        newFields.s.buf = (positive ? "+" : "-").split("");
        newFields.d.buf = (days % 10).toString().split("");
        newFields.hh.buf = (Math.floor(hours / 10).toString() + (hours % 10).toString()).split("");
        newFields.mm.buf = (Math.floor(minutes / 10).toString() + (minutes % 10).toString()).split("");

        this.updateByFields(newFields);
    }

    getValue() {
        const positive = (this.fields.s.buf[0]=="+" ? true : false);

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

        return {positive, days, hours, minutes};
    }

    validateKey(keyCode: number) {
        var ch: string = String.fromCharCode(keyCode);

        if (this.pos == 0 && !isSign(keyCode)) {
            return false;
        }

        if (this.pos != 0 && isSign(keyCode)) {
            return false;
        }

        if (this.pos != 0 &&
            !isSign(keyCode) &&
            !isFunction(keyCode) &&
            !isDigit(keyCode)) {
            return false;
        }

        return true;
    }

    validateBuf(buf: string[], fields: Fields) {
        let fullFields = 0;

        const s = fields.s.buf;
        if(s[0]!="+" && s[0]!="-") {
            return false;
        }

        const d = fields.d.buf;
        if(d[0]) {
            const num = parseInt(d[0]);
            if (isNaN(num)) {
                return false;
            }
            ++fullFields;
        }

        const hh = fields.hh.buf;
        if (hh[0] && hh[1]) {
            ++fullFields;

            const num = parseInt(hh[0] + hh[1]);
            if (isNaN(num) || num < 0 || num > 23) {
                return false;
            }
        }

        const mm = fields.mm.buf;
        if (mm[0] && mm[1]) {
            ++fullFields;

            const num = parseInt(mm[0] + mm[1]);
            if (isNaN(num) || num < 0 || num > 59) {
                return false;
            }
        }

        const str = buf.join("");
        if(fullFields==3 && !validateTimeSpanRange(str, this.options)) {
            return false;
        }

        return true;
    }

    checkComplete(buf: string[], fields: Fields) {
        const s = fields.s.buf;
        const d = fields.d.buf;
        const hh = fields.hh.buf;
        const mm = fields.mm.buf;

        if (s[0] && d[0] && hh[0] && hh[1] && mm[0] && mm[1]) {
            return true;
        }

        return false;
    }
}

import {InputMaskBase} from "./base";
import {Fields, isDigit, isFunction} from "./common";

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

    validate(keyCode: number, buf: string[], fields: Fields) {
        var ch = String.fromCharCode(keyCode);
        if(!isFunction(keyCode) &&
            !isDigit(keyCode) &&
            ch!="-" &&
            ch!="+") {
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
    }
}

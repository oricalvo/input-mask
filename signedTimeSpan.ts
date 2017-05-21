import {InputMaskBase} from "./base";
import {Fields, isDigit, isFunction, isSign, validateTimeSpanRange} from "./common";
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

    validate(keyCode: number, buf: string[], fields: Fields) {
        var ch: string = String.fromCharCode(keyCode);

        if(this.pos==0 && !isSign(keyCode)) {
            return false;
        }

        if(this.pos!=0 && isSign(keyCode)) {
            return false;
        }

        if(this.pos!=0 &&
            !isSign(keyCode) &&
            !isFunction(keyCode) &&
            !isDigit(keyCode)) {
            return false;
        }

        let fullFields = 0;

        var d = fields.d.buf;
        if(d[0]) {
            ++fullFields;
        }

        var hh = fields.hh.buf;
        if (hh[0] && hh[1]) {
            ++fullFields;

            var num = parseInt(hh[0] + hh[1]);
            if (isNaN(num) || num < 0 || num > 23) {
                return false;
            }
        }

        var mm = fields.mm.buf;
        if (mm[0] && mm[1]) {
            ++fullFields;

            var num = parseInt(mm[0] + mm[1]);
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
}

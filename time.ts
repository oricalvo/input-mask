import {InputMaskBase} from "./base";
import {Fields, isDigit, isFunction} from "./common";

export class InputMaskTime extends InputMaskBase {
    constructor(input) {
        super(input, "{hh}:{mm}");
    }

    validate(keyCode: number, buf: string[], fields: Fields) {
        if(!isFunction(keyCode) && !isDigit(keyCode)) {
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

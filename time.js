import {InputMaskPattern} from "./inputMaskPattern";
import {isDigitKeyCode} from "./common";

export class InputMaskTime extends InputMaskPattern {
    constructor(input) {
        super(input, "{hh}:{mm}");
    }

    validate(ch, value, fields) {
        if(!isDigitKeyCode(ch.charCodeAt(0))) {
            return false;
        }

        var hh = fields.hh;
        if (hh[0] != "h" && hh[1] != "h") {
            var num = parseInt(hh);
            if (isNaN(num) || num < 0 || num > 23) {
                return false;
            }
        }

        var mm = fields.mm;
        if (mm[0] != "m" && mm[1] != "m") {
            var num = parseInt(mm);
            if (isNaN(num) || num < 0 || num > 59) {
                return false;
            }
        }

        return true;
    }
}

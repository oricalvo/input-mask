import {InputMaskBase} from "./base";
import {Fields, isDigit, isFunction, isValidDate} from "./common";

export class InputMaskDate extends InputMaskBase {
    constructor(input, options?) {
        super(input, "{dd}/{mm}/{yyyy}", options);
    }

    validate(keyCode: number, buf: string[], fields: Fields) {
        if(!isFunction(keyCode) && !isDigit(keyCode)) {
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
            if (isNaN(year)) {
                return false;
            }
        }

        if(completed==3 && !isValidDate(day, month, year)) {
            this.setInvalidIndication();
        }

        return true;
    }
}

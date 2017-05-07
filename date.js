import {InputMaskPattern} from "./inputMaskPattern";
import {isDigitKeyCode, isValidDate} from "./common";

export class InputMaskDate extends InputMaskPattern {
    constructor(input) {
        super(input, "{dd}/{mm}/{yyyy}");
    }

    validate(ch, value, fields) {
        if(!isDigitKeyCode(ch.charCodeAt(0))) {
            return false;
        }

        var completed = 0;

        var dd = fields.dd;
        if (dd[0] != "d" && dd[1] != "d") {
            ++completed;
            var day = parseInt(dd);
            if (isNaN(day) || day < 1 || day > 31) {
                return false;
            }
        }

        var mm = fields.mm;
        if (mm[0] != "m" && mm[1] != "m") {
            ++completed;
            var month = parseInt(mm[0] + mm[1]);
            if (isNaN(month) || month < 1 || month > 12) {
                return false;
            }
        }

        var yyyy = fields.yyyy;
        if (yyyy[0] != "y" && yyyy[1] != "y" && yyyy[2] != "y" && yyyy[3] != "y") {
            ++completed;
            var year = parseInt(yyyy);
            if (isNaN(year) || year < 1900 || year > 2200) {
                return false;
            }
        }

        if(completed==3 && !isValidDate(day, month, year)) {
            this.input.classList.add("invalid");
        }
        else {
            this.input.classList.remove("invalid");
        }

        return true;
    }
}

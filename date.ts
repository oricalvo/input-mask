import {InputMaskBase} from "./base";
import {cloneFields, Fields, isDigit, isFunction, isValidDate} from "./common";

export class InputMaskDate extends InputMaskBase {
    constructor(input, options?) {
        super(input, "{dd}/{mm}/{yyyy}", options);
    }

    setValue(value: Date) {
        if(!value) {
            throw new Error("Invalid date value");
        }

        const newFields = cloneFields(this.fields);

        const days = value.getDate();
        newFields.dd.buf = (Math.floor(days / 10).toString() + (days % 10).toString()).split("");

        const month = value.getMonth() + 1;
        newFields.mm.buf = (Math.floor(month / 10).toString() + (month % 10).toString()).split("");

        const year = value.getFullYear();
        newFields.yyyy.buf = year.toString().split("").slice(0,4);

        this.updateByFields(newFields);
    }

    getValue() {
        const day = parseInt(this.fields.dd.buf.join(""));
        if(isNaN(day)) {
            return undefined;
        }

        const month = parseInt(this.fields.mm.buf.join("")) - 1;
        if(isNaN(month)) {
            return undefined;
        }

        const year = parseInt(this.fields.yyyy.buf.join(""));
        if(isNaN(year)) {
            return undefined;
        }

        const now = new Date();
        const d = new Date(year, month, day, 0, 0);
        return d;
    }

    validateKey(keyCode: number) {
        if (!isFunction(keyCode) && !isDigit(keyCode)) {
            return false;
        }

        return true;
    }

    validateBuf(buf: string[], fields: Fields) {
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

    checkComplete(buf: string[], fields: Fields) {
        const dd = fields.dd.buf;
        const mm = fields.mm.buf;
        const yyyy = fields.yyyy.buf;

        if (dd[0] && dd[1] && mm[0] && mm[1] && yyyy[0] && yyyy[1] && yyyy[2] && yyyy[3]) {
            return true;
        }

        return false;
    }
}

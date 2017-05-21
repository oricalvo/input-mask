import {InputMaskBase} from "./base";
import {cloneFields, cloneFieldsByPos, Fields, isDigit, isFunction} from "./common";

export class InputMaskTime extends InputMaskBase {
    constructor(input) {
        super(input, "{hh}:{mm}");
    }

    setValue(value: Date) {
        if(!value) {
            throw new Error("Invalid date value");
        }

        const newFields = cloneFields(this.fields);

        const hours = value.getHours();
        newFields.hh.buf = (Math.floor(hours / 10).toString() + (hours % 10).toString()).split("");

        const minutes = value.getMinutes();
        newFields.mm.buf = (Math.floor(minutes / 10).toString() + (minutes % 10).toString()).split("");

        this.updateByFields(newFields);
    }

    getValue() {
        const hh = this.fields.hh.buf;
        if(hh[0]===undefined || hh[1]===undefined) {
            return undefined;
        }

        const hours = parseInt(hh.join(""));
        if(isNaN(hours)) {
            return undefined;
        }

        const mm = this.fields.mm.buf;
        if(mm[0]===undefined || mm[1]===undefined) {
            return undefined;
        }

        const minutes = parseInt(mm.join(""));
        if(isNaN(minutes)) {
            return undefined;
        }

        //
        //  Only the hours and minutes matter
        //
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        return d;
    }

    isValid() {
        return this.validate(undefined, this.buf, this.fields);
    }

    validate(keyCode: number, buf: string[], fields: Fields) {
        if(keyCode!==undefined && !isFunction(keyCode) && !isDigit(keyCode)) {
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

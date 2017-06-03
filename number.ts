export interface NumberOptions {
    noDot: boolean;
    noNegative: boolean;
    min?: number;
    max?: number;
}

export function inputMaskNumber(input, options: NumberOptions) {
    options = options || {
        noDot: false,
        noNegative: false,
    };

    if(!options.hasOwnProperty("noNegative")) {
        options.noNegative = false;
    }

    function allowKey(ch, value) {
        if(options.noDot && ch == ".") {
            return false;
        }

        if(options.noNegative && ch=="-") {
            return false;
        }

        if(value=="+" || value=="-") {
            return true;
        }

        const num = Number(value);
        if (isNaN(num)) {
            return false;
        }

        return true;
    }

    function clearInvalidIndication() {
        input.classList.remove("invalid");
    }

    function setInvalidIndication() {
        input.classList.add("invalid");
    }

    function validate(value: string) {
        mask.isValid = false;
        mask.isComplete = false;

        clearInvalidIndication();

        if(value === "") {
            mask.isValid = true;
            mask.isComplete = false;
            return;
        }

        const num = Number(value);
        if (isNaN(num)) {
            return;
        }

        if(options && options.hasOwnProperty("min") && num < options.min) {
            setInvalidIndication();
            return;
        }

        if(options && options.hasOwnProperty("max") && num > options.max) {
            setInvalidIndication();
            return;
        }

        mask.isValid = true;
        mask.isComplete = true;
    }

    input.addEventListener("keydown", function(e) {
        setTimeout(function(){
            validate(input.value);
        }, 0);
    });

    input.addEventListener("keypress", function(e) {
        const ch = String.fromCharCode(e.which);
        const buf = input.value.split("");
        buf.splice(input.selectionStart, 0, ch);
        const value = buf.join("");

        if(!allowKey(ch, value)) {
            e.preventDefault();
        }

        validate(value);
    });

    const mask = {
        isValid: false,

        isComplete: false,

        getValue: function() {
            const res = parseFloat(input.value);
            if(isNaN(res)) {
                return undefined;
            }

            return res;
        },

        setValue: function(num) {
            this.isValid = false;
            this.isComplete = false;

            if(isNaN(num*1)) {
                return;
            }

            const value = num.toString();
            if(!allowKey(undefined, value)) {
                return;
            }

            input.value = value;

            validate(value);
        },
    };

    return mask;
}

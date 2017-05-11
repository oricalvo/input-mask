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

    function validate(ch, buf, value) {
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

    function resetIndication(value: string) {
        clearInvalidIndication();

        if(value === "") {
            return;
        }

        const num = Number(value);
        if (isNaN(num)) {
            return;
        }

        if(options && options.hasOwnProperty("min") && num < options.min) {
            setInvalidIndication();
        }

        if(options && options.hasOwnProperty("max") && num > options.max) {
            setInvalidIndication();
        }
    }

    input.addEventListener("keydown", function(e) {
        setTimeout(function(){
            resetIndication(input.value);
        }, 0);
    });

    input.addEventListener("keypress", function(e) {
        const ch = String.fromCharCode(e.which);
        const buf = input.value.split("");
        buf.splice(input.selectionStart, 0, ch);
        const value = buf.join("");

        if(!validate(ch, buf, value)) {
            e.preventDefault();
        }
    });
}

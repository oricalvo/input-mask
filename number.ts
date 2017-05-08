export function inputMaskNumber(input, options) {
    options = options || {};

    function validate(ch, buf, value) {
        console.log("VALIDATE");

        if(options.noDot && ch == ".") {
            return false;
        }

        if(value=="+" || value=="-") {
            return true;
        }

        const num = Number(value);
        if (isNaN(num)) {
            return false;
        }

        if(options.hasOwnProperty("maxlength") && value.length > options.maxlength) {
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
        console.log("DOWN");

        setTimeout(function(){
            resetIndication(input.value);
        }, 0);
    });

    input.addEventListener("keypress", function(e) {
        console.log("UP");

        const ch = String.fromCharCode(e.which);
        const buf = input.value.split("");
        buf.splice(input.selectionStart, 0, ch);
        const value = buf.join("");

        if(!validate(ch, buf, value)) {
            e.preventDefault();
        }
    });
}

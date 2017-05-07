export function inputMaskInteger(input) {
    input.addEventListener("keypress", function(e) {
        var buf = input.value.split("");
        buf.splice(input.selectionStart, 0, String.fromCharCode(e.which));
        var value = buf.join("");

        if(value=="+" || value=="-") {
            return;
        }

        if (isNaN(parseInt(value))) {
            e.preventDefault();
            return;
        }
    });
}

export function inputMaskDouble(input) {
    input.addEventListener("keypress", function(e) {
        var buf = input.value.split("");
        buf.splice(input.selectionStart, 0, String.fromCharCode(e.which));
        var value = buf.join("");

        if(value=="+" || value=="-") {
            return;
        }

        if (isNaN(parseFloat(value))) {
            e.preventDefault();
            return;
        }
    });
}

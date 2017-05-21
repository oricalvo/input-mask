inputMask.create("integer", document.querySelector(".integer input"), {
    min: 500,
    max: 750,
});

inputMask.create("integer", document.querySelector(".integer-no-negative input"), {
    noNegative: true,
});

inputMask.create("double", document.querySelector(".double input"), {
    min: 1,
    max: 1000,
});

inputMask.create("date", document.querySelector(".date input"));

const time = inputMask.create("time", document.querySelector(".time input"));

let btn = document.querySelector(".time button.get-value");
if(btn) {
    btn.addEventListener("click", function() {
        console.log(time.getValue());
    });
}

btn = document.querySelector(".time button.set-value");
if(btn) {
    btn.addEventListener("click", function() {
        time.setValue(new Date());
    });
}

inputMask.create("timeSpan", document.querySelector(".time-span input"));

inputMask.create("signedTimeSpan", document.querySelector(".signed-time-span input"));



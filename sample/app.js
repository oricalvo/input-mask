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

inputMask.create("time", document.querySelector(".time input"));

inputMask.create("timeSpan", document.querySelector(".time-span input"));


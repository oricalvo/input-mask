inputMask.create("integer", document.querySelector(".integer input"), {
    min: 5,
    max: 10,
});

inputMask.create("double", document.querySelector(".double input"));

inputMask.create("date", document.querySelector(".date input"));

inputMask.create("time", document.querySelector(".time input"));

inputMask.create("timeSpan", document.querySelector(".time-span input"));

var masks = [
    {
        selector: ".integer",
        factory: function (element) {
            return inputMask.create("integer", element, {
                min: 500,
                max: 750,
            });
        },
        value: [1234],
    },

    {
        selector: ".integer-no-negative",
        factory: function (element) {
            return inputMask.create("integer", element, {
                noNegative: true,
            });
        },
        value: [1234],
    },

    {
        selector: ".double",
        factory: function (element) {
            return inputMask.create("double", element, {
                min: 1,
                max: 1000,
            });
        },
        value: [12.34],
    },
];

for(let entry of masks) {
    const element = document.querySelector(entry.selector);
    if(!element) {
        console.warning("Selector: " + selector + " was not found");
        continue;
    }

    const input = element.querySelector("input");
    if(!input) {
        console.warning("Input for selector: " + selector + " was not found");
        continue;
    }

    const mask = entry.factory(input);

    let btn = element.querySelector("button.get-value");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(mask.getValue());
        });
    }

    btn = element.querySelector("button.set-value");
    if (btn) {
        btn.addEventListener("click", function () {
            mask.setValue.apply(mask, entry.value);
        });
    }

    btn = element.querySelector("button.is-valid");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(mask.isValid);
        });
    }

    btn = element.querySelector("button.is-complete");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(mask.isComplete);
        });
    }
}

createDate();

createTime();

createTimeSpan();

createSignedTimeSpan();

function createTimeSpan() {
    const timeSpan = inputMask.create("timeSpan", document.querySelector(".time-span input"));

    let btn = document.querySelector(".time-span button.get-value");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(timeSpan.getValue());
        });
    }

    btn = document.querySelector(".time-span button.set-value");
    if (btn) {
        btn.addEventListener("click", function () {
            timeSpan.setValue(1, 2, 34);
        });
    }

    btn = document.querySelector(".time-span button.is-valid");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(timeSpan.isValid);
        });
    }

    btn = document.querySelector(".time-span button.is-complete");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(timeSpan.isComplete);
        });
    }
}

function createDate() {
    const date = inputMask.create("date", document.querySelector(".date input"));

    let btn = document.querySelector(".date button.set-value");
    if (btn) {
        btn.addEventListener("click", function () {
            date.setValue(new Date());
        });
    }

    btn = document.querySelector(".date button.get-value");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(date.getValue());
        });
    }

    btn = document.querySelector(".date button.is-valid");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(date.isValid);
        });
    }

    btn = document.querySelector(".date button.is-complete");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(date.isComplete);
        });
    }
}

function createTime() {
    const time = inputMask.create("time", document.querySelector(".time input"));

    let btn = document.querySelector(".time button.get-value");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(time.getValue());
        });
    }

    btn = document.querySelector(".time button.set-value");
    if (btn) {
        btn.addEventListener("click", function () {
            time.setValue(new Date());
        });
    }

    btn = document.querySelector(".time button.is-valid");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(time.isValid);
        });
    }

    btn = document.querySelector(".time button.is-complete");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(time.isComplete);
        });
    }
}

function createSignedTimeSpan() {
    const timeSpan = inputMask.create("signedTimeSpan", document.querySelector(".signed-time-span input"));

    let btn = document.querySelector(".signed-time-span button.get-value");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(timeSpan.getValue());
        });
    }

    btn = document.querySelector(".signed-time-span button.set-value");
    if (btn) {
        btn.addEventListener("click", function () {
            timeSpan.setValue(true, 1, 2, 34);
        });
    }

    btn = document.querySelector(".signed-time-span button.is-valid");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(timeSpan.isValid);
        });
    }

    btn = document.querySelector(".signed-time-span button.is-complete");
    if (btn) {
        btn.addEventListener("click", function () {
            console.log(timeSpan.isComplete);
        });
    }
}

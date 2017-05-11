import {inputMaskNumber, NumberOptions} from "./number";

export function inputMaskInteger(input, options?: NumberOptions) {
    options = options || {
        noDot: true,
        noNegative: false
    };

    options.noDot = true;

    inputMaskNumber(input, options);
}

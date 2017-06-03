import {inputMaskNumber, NumberOptions} from "./number";

export function inputMaskInteger(input, options?: NumberOptions) {
    options = options || {
        noDot: true,
        noNegative: false
    };

    options.noDot = true;

    return inputMaskNumber(input, options);
}

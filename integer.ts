import {inputMaskNumber} from "./number";
export function inputMaskInteger(input, options) {
    options = options || {};
    options.noDot = true;

    inputMaskNumber(input, options);
}

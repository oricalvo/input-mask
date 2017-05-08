import {InputMaskTime} from "./time";
import {InputMaskDate} from "./date";
import {InputMaskTimeSpan} from "./timeSpan";
import {inputMaskDouble} from "./double";
import {inputMaskInteger} from "./integer";

export function create(type, element, options) {
    if(type == "time") {
        new InputMaskTime(element);
    }
    else if(type == "date") {
        new InputMaskDate(element);
    }
    else if(type == "timeSpan") {
        new InputMaskTimeSpan(element);
    }
    else if(type == "integer") {
        inputMaskInteger(element, options);
    }
    else if(type == "double") {
        inputMaskDouble(element);
    }
    else {
        throw new Error("Unknown inputMask type: " + type);
    }
}

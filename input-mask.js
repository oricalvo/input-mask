import {InputMaskTime} from "./time";
import {InputMaskDate} from "./date";
import {InputMaskTimeSpan} from "./timeSpan";
import {inputMaskInteger} from "./integer";
import {inputMaskDouble} from "./double";

export function inputMask(element, type) {
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
        inputMaskInteger(element);
    }
    else if(type == "double") {
        inputMaskDouble(element);
    }
    else {
        throw new Error("Unknown inputMask type: " + type);
    }
}

import {InputMaskTime} from "./time";
import {InputMaskDate} from "./date";
import {InputMaskTimeSpan} from "./timeSpan";
import {inputMaskDouble} from "./double";
import {inputMaskInteger} from "./integer";
import {InputMaskSignedTimeSpan} from "./signedTimeSpan";

export function create(type, element, options) {
    if(type == "time") {
        return new InputMaskTime(element);
    }
    else if(type == "date") {
        return new InputMaskDate(element);
    }
    else if(type == "timeSpan") {
        return new InputMaskTimeSpan(element, options);
    }
    else if(type == "signedTimeSpan") {
        return new InputMaskSignedTimeSpan(element, options);
    }
    else if(type == "integer") {
        return inputMaskInteger(element, options);
    }
    else if(type == "double") {
        return inputMaskDouble(element);
    }
    else {
        throw new Error("Unknown inputMask type: " + type);
    }
}

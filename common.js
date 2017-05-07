export const KEY_0 = "0".charCodeAt(0);
export const KEY_9 = "9".charCodeAt(0);
export const KEY_RIGHT = 39;
export const KEY_LEFT = 37;
export const KEY_BACKSPACE = 8;

export function isDigitKeyCode(keyCode) {
    return (keyCode >= KEY_0 && keyCode <= KEY_9);
}

export function isValidDate(day, month, year) {
    var date = new Date(year, month-1, day);

    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    if(year!=y || month-1!=m || day!=d) {
        return false;
    }

    return true;
}

export function parsePattern(pattern) {
    var fields = [];

    var startFrom = 0;
    var fix = 0;

    while(startFrom < pattern.length) {
        var begin = pattern.indexOf("{", startFrom);
        if (begin == -1) {
            break;
        }

        var end = pattern.indexOf("}", begin + 1)
        if (end == -1 || end==begin+1) {
            throw new Error("Invalid pattern " + pattern);
        }

        var name = pattern.substring(begin + 1, end);
        var field = {
            name: name,
            begin: begin - fix,
            end: end - 1 - fix,
        };

        fields.push(field);
        fix += 2;

        startFrom = end + 1;
    }

    return {
        pattern: pattern.replace(new RegExp("{|}", "g"), ""),
        fields: fields,
    }
}

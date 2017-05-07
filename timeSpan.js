import {InputMaskPattern} from "./inputMaskPattern";
import {isDigitKeyCode} from "./common";

export class InputMaskTimeSpan extends InputMaskPattern {
    constructor(input) {
        super(input, "{d}.{hh}:{mm}");
    }

    validate(ch, value, fields) {
        if(!isDigitKeyCode(ch.charCodeAt(0))) {
            return false;
        }

        var hh = fields.hh;
        if (hh[0] != "h" && hh[1] != "h") {
            var num = parseInt(hh[0] + hh[1]);
            if (isNaN(num) || num < 0 || num > 23) {
                return false;
            }
        }

        var mm = fields.mm;
        if (mm[0] != "m" && mm[1] != "m") {
            var num = parseInt(mm[0] + mm[1]);
            if (isNaN(num) || num < 0 || num > 59) {
                return false;
            }
        }

        return true;
    }
}

// function inputMaskTimeSpan(input) {
//     var pos = 0;
//     var pattern = "d.hh:mm";
//     var max_pos = pattern.length;
//     var seperators = [":","."];
//     var buf = pattern.split("");
//
//     init();
//
//     function init() {
//         input.value = buf.join("");
//
//         input.addEventListener("keydown", onKeyDown);
//         input.addEventListener("keypress", onKeyPress);
//         input.addEventListener("focus", onFocus);
//     }
//
//     function validate(buf) {
//         var dd = buf.slice(0, 1);
//         if (!isDigitKeyCode(dd[0].charCodeAt(0))) {
//             return false;
//         }
//
//         var hh = buf.slice(2, 4);
//         if (hh[0] != "h" && hh[1] != "h") {
//             var num = parseInt(hh[0] + hh[1]);
//             if (isNaN(num) || num < 0 || num > 23) {
//                 return false;
//             }
//         }
//
//         var mm = buf.slice(6, 8);
//         if (mm[0] != "m" && mm[1] != "m") {
//             var num = parseInt(mm[0] + mm[1]);
//             if (isNaN(num) || num < 0 || num > 59) {
//                 return false;
//             }
//         }
//
//         return true;
//     }
//
//     function onKeyDown(e) {
//         console.log("keydown");
//
//         var cmd = null;
//         var newBuf = null;
//
//         if (e.which == KEY_RIGHT) {
//             cmd = next;
//         }
//         else if (e.which == KEY_LEFT) {
//             cmd = prev;
//         }
//         else if (e.which == KEY_BACKSPACE) {
//             if(pos==max_pos) {
//                 pos--;
//             }
//
//             newBuf = buf.concat([]);
//             newBuf[pos] = pattern[pos];
//             cmd = prev;
//         }
//
//         if(cmd) {
//             e.preventDefault();
//
//             setTimeout(function() {
//                 if(newBuf) {
//                     update(newBuf);
//                 }
//
//                 cmd();
//             }, 0);
//         }
//     }
//
//     function onKeyPress(e) {
//         console.log("keypress");
//
//         if(pos==max_pos || !isDigitKeyCode(e.which)) {
//             e.preventDefault();
//             return;
//         }
//
//         const ch = String.fromCharCode(e.which);
//         var newBuf = buf.concat([]);
//         newBuf[pos] = ch;
//
//         e.preventDefault();
//
//         if(validate(newBuf)) {
//             setTimeout(function() {
//                 update(newBuf);
//
//                 next();
//             }, 0);
//         }
//     }
//
//     function onFocus(e) {
//         console.log("onFocus");
//
//         setTimeout(function() {
//             setSelection();
//         }, 0)
//     }
//
//     function update(newBuf) {
//         input.value = newBuf.join("");
//         buf = newBuf;
//     }
//
//     function setSelection() {
//         console.log("setSelection", pos);
//
//         if (pos == max_pos) {
//             input.setSelectionRange(max_pos, max_pos);
//         }
//         else {
//             input.setSelectionRange(pos, pos + 1);
//         }
//     }
//
//     function isSeperator(ch) {
//         return seperators.indexOf(ch) != -1;
//     }
//
//     function next() {
//         if(pos<max_pos) {
//             while (isSeperator(buf[++pos])) {
//                 if (pos == max_pos) {
//                     break;
//                 }
//             }
//         }
//
//         setSelection();
//     }
//
//     function prev() {
//         if(pos>0) {
//             while (isSeperator(buf[--pos])) {
//                 if (pos == -1) {
//                     pos = 0;
//                     break;
//                 }
//             }
//         }
//
//         setSelection();
//     }
// }

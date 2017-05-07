import {KEY_BACKSPACE, KEY_LEFT, KEY_RIGHT, parsePattern} from "./common";
export class InputMaskPattern {
    constructor(input, pattern) {
        this.input = input;
        this.pos = 0;

        const info = parsePattern(pattern);
        this.pattern = info.pattern;
        this.max_pos = this.pattern.length;
        this.fields = info.fields;
        this.buf = this.pattern.split("");

        this.input.value = this.pattern;
        this.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.input.addEventListener("keypress", this.onKeyPress.bind(this));
        this.input.addEventListener("focus", this.onFocus.bind(this));
    }

    isSeperator(pos) {
        for (let field of this.fields) {
            if (pos >= field.begin && pos < field.end) {
                return false;
            }
        }

        return true;
    }

    onKeyDown(e) {
        var cmd = null;
        var newBuf = null;

        if (e.which == KEY_RIGHT) {
            cmd = this.next;
        }
        else if (e.which == KEY_LEFT) {
            cmd = this.prev;
        }
        else if (e.which == KEY_BACKSPACE) {
            newBuf = this.buf.concat([]);
            newBuf[this.pos] = this.pattern[this.pos];
            cmd = this.prev;
        }

        if (cmd || newBuf) {
            e.preventDefault();

            setTimeout(() => {
                if (newBuf) {
                    this.update(newBuf);
                }

                if(cmd) {
                    cmd.call(this);
                }
            }, 0);
        }
    }

    onKeyPress(e) {
        if (this.pos == this.max_pos) {
            e.preventDefault();
            return;
        }

        const ch = String.fromCharCode(e.which);
        var newBuf = this.buf.concat([]);
        newBuf[this.pos] = ch;

        e.preventDefault();

        var fields = {};
        for(let field of this.fields) {
            const value = newBuf.slice(field.begin, field.end);
            fields[field.name] = value.join("");
        }

        if (this.validate(ch, newBuf.join(""), fields)) {
            setTimeout(() => {
                this.update(newBuf);

                this.next();
            }, 0);
        }
    }

    validate(ch, value, fields) {
        return true;
    }

    onFocus(e) {
        setTimeout(() => {
            this.setSelection();
        }, 0);
    }

    update(newBuf) {
        this.input.value = newBuf.join("");
        this.buf = newBuf;
    }

    setSelection() {
        if (this.pos == this.max_pos) {
            this.input.setSelectionRange(this.max_pos, this.max_pos);
        }
        else {
            this.input.setSelectionRange(this.pos, this.pos + 1);
        }
    }

    next() {
        if (this.pos < this.max_pos) {
            while (this.isSeperator(++this.pos)) {
                if (this.pos == this.max_pos) {
                    break;
                }
            }
        }

        this.setSelection();
    }

    prev() {
        if (this.pos > 0) {
            while (this.isSeperator(--this.pos)) {
                if (this.pos == -1) {
                    this.pos = 0;
                    break;
                }
            }
        }

        this.setSelection();
    }
}

import {
    cloneBuf, cloneFields, Fields, findFieldByPos, isValidDate, KEY_BACKSPACE, KEY_DELETE, KEY_DOWN, KEY_LEFT,
    KEY_RIGHT, KEY_UP,
    parsePattern
} from "./common";

export abstract class InputMaskBase {
    input: HTMLInputElement;
    pos: number;
    pattern: string;
    max_pos: number;
    buf: any[];
    fields: Fields;
    options: any;

    constructor(input, pattern, options?) {
        this.input = input;
        this.pos = 0;
        this.options = options || {};

        const info = parsePattern(pattern);
        this.pattern = info.pattern;
        this.max_pos = this.pattern && this.pattern.length;
        this.fields = info.fields;
        this.buf = info.buf;

        this.input.value = this.pattern;
        this.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.input.addEventListener("keypress", this.onKeyPress.bind(this));
        this.input.addEventListener("focus", this.onFocus.bind(this));
        this.input.addEventListener("mousedown", this.onMouseDown.bind(this));
    }

    isSeperator(pos) {
        for (let key in this.fields) {
            const field = this.fields[key];
            if (pos >= field.begin && pos < field.end) {
                return false;
            }
        }

        return true;
    }

    onKeyDown(e) {
        let cmd = null;
        let newBuf = null;
        let newFields = null;

        if (e.which == KEY_RIGHT) {
            cmd = this.next;
        }
        else if (e.which == KEY_LEFT) {
            cmd = this.prev;
        }
        else if (e.which == KEY_BACKSPACE) {
            newBuf = cloneBuf(this.buf, this.pos, undefined);
            newFields = cloneFields(this.fields, this.pos, undefined);
            cmd = this.prev;
        }
        else if (e.which == KEY_DELETE) {
            e.preventDefault();
            return;
        }
        else if (e.which == KEY_DOWN) {
            e.preventDefault();
            return;
        }
        else if (e.which == KEY_UP) {
            e.preventDefault();
            return;
        }

        if (cmd || newBuf) {
            e.preventDefault();

            setTimeout(() => {
                if (newBuf) {
                    //
                    //  Call validate and ignore return value
                    //  We allow backspace for invalid value
                    //  We still need to call "validate" since it may change the input apearance (CSS)
                    //
                    this.validate(e.which, newBuf, newFields);
                    this.update(newBuf, newFields);
                }

                if(cmd) {
                    cmd.call(this);
                }
            }, 0);
        }
    }

    canType(pos) {
        if(this.pattern && this.pos == this.max_pos) {
            return false;
        }

        return true;
    }

    onKeyPress(e) {
        if (!this.canType(this.pos)) {
            e.preventDefault();
            return;
        }

        const ch = String.fromCharCode(e.which);
        const newBuf = cloneBuf(this.buf, this.pos, ch);
        const newFields = cloneFields(this.fields, this.pos, ch);

        e.preventDefault();

        if (this.validate(ch.charCodeAt(0), newBuf, newFields)) {
            setTimeout(() => {
                this.update(newBuf, newFields);

                this.next();
            }, 0);
        }
    }

    abstract validate(keyCode: number, buf: string[], fields: Fields);

    onFocus(e) {
        setTimeout(() => {
            this.setSelection();
        }, 0);
    }

    update(newBuf, fields) {
        const oldBuf = this.buf;

        const value = newBuf.concat();
        for(let i=0; i<value.length; i++) {
            if(!value[i]) {
                value[i] = this.pattern[i];
            }
        }

        this.input.value = value.join("");
        this.buf = newBuf;
        this.fields = fields;
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

    onChanged() {
    }

    clearInvalidIndication() {
        this.input.classList.remove("invalid");
    }

    setInvalidIndication() {
        this.input.classList.add("invalid");
    }

    onMouseDown(e) {
        e.preventDefault();

        e.target.focus();

        setTimeout(() => {
            this.setSelection();
        }, 0);
    }
}

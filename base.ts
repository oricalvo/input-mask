import {
    cloneBuf, cloneFieldsByPos, copyArray, Fields, FieldsOptions, findFieldByPos, isValidDate, KEY_BACKSPACE, KEY_DELETE,
    KEY_DOWN,
    KEY_LEFT,
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

    constructor(input, pattern, fieldsOptions?: FieldsOptions) {
        this.input = input;
        this.pos = 0;

        const info = parsePattern(pattern);
        this.pattern = info.pattern;
        this.max_pos = this.pattern && this.pattern.length;
        this.fields = info.fields;
        this.buf = info.buf;

        this.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.input.addEventListener("keypress", this.onKeyPress.bind(this));
        this.input.addEventListener("focus", this.onFocus.bind(this));
        this.input.addEventListener("mousedown", this.onMouseDown.bind(this));

        for(let key in this.fields) {
            const field = this.fields[key];
            field.options = (fieldsOptions && fieldsOptions[key]) || {};
        }

        for(let key in this.fields) {
            const field = this.fields[key];
            if(field.options.defValue) {
                field.buf = field.options.defValue.substring(0, field.len).split("");
                copyArray(field.buf, 0, field.len, this.buf, field.begin);
            }
        }

        this.input.value = this.pattern;
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
        console.log("keyDown", e.keyCode);

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
            newFields = cloneFieldsByPos(this.fields, this.pos, undefined);
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
        console.log("keyPress", e.key, e.keyCode, e.charCode);

        if (!this.canType(this.pos)) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        this.internalPressKey(e.keyCode);
    }

    internalPressKey(keyCode) {
        const ch = String.fromCharCode(keyCode);
        const newBuf = cloneBuf(this.buf, this.pos, ch);
        const newFields = cloneFieldsByPos(this.fields, this.pos, ch);

        if (this.validate(keyCode, newBuf, newFields)) {
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

    updateByFields(newFields: Fields) {
        const newBuf = this.buf.concat([]);
        for(let key in newFields) {
            const field = newFields[key];

            copyArray(field.buf, 0, field.buf.length, newBuf, field.begin);
        }

        this.update(newBuf, newFields);
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


export type FlushCallback<T> = (values: Array<T>) => void;

export class FlushableCollection<T> {
    private buffer: Array<T>;
    private index: number;

    constructor(private size: number, private intervalSec: number, private onFlush: FlushCallback<T>) {
        this.buffer = new Array(size);
        this.index = 0;

        if (this.intervalSec > 0) {
            setInterval(() => this.flush(), intervalSec * 1000);
        }
    }

    private flush() {
        if (this.index === 0) {
            return;
        }

        this.onFlush(this.buffer.slice(0, this.index));
        this.buffer = new Array(this.size);
        this.index = 0;
    }

    private enshureFlush() {
        if (this.index >= this.size) {
            this.flush();
        }
    }

    private addNext(value: T) {
        this.buffer[this.index] = value;
        this.index++;
    }

    add(value: T) {
        this.addNext(value);
        this.enshureFlush();
    }
}
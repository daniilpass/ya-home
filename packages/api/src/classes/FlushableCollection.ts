
export type FlushCallback<T> = (values: Array<T>) => void;

export class FlushableCollection<T> {
    private buffer: Array<T>;
    private index: number;

    constructor(private size: number, private onFlush: FlushCallback<T>) {
        this.buffer = new Array(size);
        this.index = 0;
    }

    private get full() {
        return this.index === this.size;
    }

    private flush() {
        this.onFlush(this.buffer);
        this.buffer = new Array(this.size);
        this.index = 0;
    }

    private enshureFlush() {
        if (this.full) {
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
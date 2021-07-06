export class Stream {
    private buffer: Buffer;

    private offset: number = 0;

    constructor(buffer: Buffer) {
        this.buffer = buffer
    }

    read(len: number, save: boolean = true): Buffer {
        const buffer = this.buffer.slice(this.offset, this.offset + len)
        if(save) this.offset += len
        return buffer
    }

    readString(len: number, save: boolean = true): string {
        return this.read(len, save).toString('utf8')
    }

    readUInt(len: number, save: boolean = true): number {
        return this.read(len, save).readUIntBE(0, len)
    }

    readBites(len: number, save: boolean = true): string {
        return this.readUInt(len, save).toString(2)
    }

    getLastLength(): number {
        return this.buffer.length-this.offset
    }

    getLastBuffer(): Buffer {
        return this.read(this.getLastLength(), false)
    }
}

export class BitsStream {
    private bits: string[];

    constructor(bits: string) {
        this.bits = bits.split('')
    }

    read(len: number): string {
        return this.bits.splice(0, len).join('')
    }

    readInt(len: number): number {
        return parseInt(this.read(len), 2)
    }

    readBool() {
        return Boolean(this.readInt(1))
    }
}
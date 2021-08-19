import { ExtendedBuffer, WriteExtendedBuffer } from "./buffer";

export function decodeZeroBytes(buffer: Buffer): Buffer {
    let countZero: number = 0;
    let countNewZero: number = 0;

    let isNextCount: boolean = false;
    for (const byte of buffer) {
        if (isNextCount) {
            isNextCount = false
            countNewZero += byte;
            countZero++
            continue;
        }

        if (byte !== 0) continue;

        countZero++
        isNextCount = true
    }

    const newBuffer: Buffer = Buffer.alloc(buffer.length - countZero + countNewZero)

    let offset: number = 0

    const bytes: number[] = Array.from(buffer);
    let nextSkip: boolean = false;
    for (const i in bytes) {
        if (nextSkip) {
            nextSkip = false;
            continue;
        }

        const byte = bytes[i];

        if (byte === 0) {
            const count = bytes[+i + 1]
            nextSkip = true

            for (let i = 0; i < count; i++) {
                newBuffer.writeInt8(0, offset)
                offset++
            }

            continue;
        }

        newBuffer.writeUInt8(byte, offset)

        offset++;
    }

    return newBuffer
}

export function encodeZeroBytes(buffer: Buffer): Buffer {
    let countZero: number = 0;
    let zeroParts: number = 0;

    let isLastZero: boolean = false;
    for (const byte of buffer) {
        if (byte !== 0) {
            if(isLastZero) {
                isLastZero = false
                zeroParts++
            }
            continue;
        }

        countZero++
        isLastZero = true
    }

    const newBuffer: Buffer = Buffer.alloc(buffer.length - countZero + zeroParts * 2)

    let offset: number = 0

    const bytes: number[] = Array.from(buffer);
    let currentZeroCount: number = 0;
    for (const i in bytes) {
        const byte = bytes[i];

        if (byte !== 0) {
            newBuffer.writeUInt8(byte, offset)

            offset++;

            continue;
        }

        currentZeroCount++

        if(bytes[+i+1] === 0) continue;

        newBuffer.writeInt8(0, offset)
        offset++
        newBuffer.writeUInt8(currentZeroCount, offset)
        offset++
        currentZeroCount = 0
    }

    return newBuffer
}

function posmod(a: number, b: number): number {
    let resto = a % b
    
    if(resto == 0) resto = Math.abs(resto)

    return resto < 0 ? resto + Math.abs(b) : resto;
}

export function writeTLBytes(buffer: WriteExtendedBuffer, bytes: Buffer): void {
    const length = bytes.length

    if(length <= 253) {
        buffer.writeUInt8(length)
        buffer.writeBuffer(bytes)
        buffer.writeZeroBytes(posmod(-length-1, 4))
    } else {
        buffer.writeUInt8(254)
        buffer.writeUInt24LE(length)
        buffer.writeBuffer(bytes)
        buffer.writeZeroBytes(posmod(-length, 4))
    }
}

export function writeTLString(buffer: WriteExtendedBuffer, value: string) {
    writeTLBytes(buffer, Buffer.from(value))
}

export function readTLBytes(buffer: ExtendedBuffer): Buffer {
    let output: Buffer;

    let length: number = buffer.readUInt8()

    if (length > 254) {
        throw new Error('file telegram string length too big!');
    }

    let resto: number = 0;

    if(length === 254) {
        const newLength = buffer.readUInt24LE()
        output = buffer.readBuffer(newLength)
        resto = posmod(-newLength, 4)
    } else {
        output = length ? buffer.readBuffer(length) : Buffer.alloc(0)
        resto = posmod(-(length+1), 4)
    }

    if(resto > 0) buffer.skip(resto)

    return output;
}

export function readTLString(buffer: ExtendedBuffer): string {
    return readTLBytes(buffer).toString()
}
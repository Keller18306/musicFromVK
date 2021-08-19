import { ExtendedBuffer } from "./buffer";
import { decodeZeroBytes, readTLBytes, readTLString } from "./helpers";
import { FileType, FILE_REFERENCE_FLAG, PERSISTENT_ID_VERSION, typesNames, WEB_LOCATION_FLAG } from "./types";

export function internalDecode(file_id: string) {
    const buffer = new ExtendedBuffer(file_id, 'base64')

    buffer.buffer = decodeZeroBytes(buffer.buffer)

    const version = buffer.readUInt8(buffer.buffer.length - 1)
    if (version != 4) throw new Error('unsupported file_id version')

    const subVersion = buffer.readUInt8(buffer.buffer.length - 2)

    const rawTypeId: number = buffer.readUInt32LE()

    const hasReference: boolean = (rawTypeId & FILE_REFERENCE_FLAG) !== 0
    const hasWebLocation: boolean = (rawTypeId & WEB_LOCATION_FLAG) !== 0

    let typeId: number = rawTypeId;
    if (hasReference) typeId -= FILE_REFERENCE_FLAG
    if (hasWebLocation) typeId -= WEB_LOCATION_FLAG

    const dcId: number = buffer.readUInt32LE()

    let fileReference: Buffer | undefined;
    if (hasReference) fileReference = readTLBytes(buffer)

    let url: string | undefined;
    let id: bigint | undefined
    if(hasWebLocation) url = readTLString(buffer)
    else id = buffer.readBigInt64LE()

    const access_hash = buffer.readBigInt64LE()

    if(!hasWebLocation && typeId <= FileType.Photo) {
        //TO DO PHOTO DECODE
    }

    buffer.skip(2)

    return {
        version,
        subVersion,
        hasReference,
        hasWebLocation,
        typeId,
        dcId,
        fileReference,
        url,
        id,
        access_hash
    }
}
/*
export class FileIDDecoder {
    readonly file_id: string;

    private buffer: Buffer;

    constructor(file_id: string) {
        this.file_id = file_id

        this.buffer = decodeZeroBytes(Buffer.from(file_id, 'base64url'));

        if (this.getVersion() != PERSISTENT_ID_VERSION) throw new Error('unsupported file_id version')
    }

    private getRawTypeId(): number {
        return this.buffer.readUInt32LE(0)
    }

    private readTLString(offset: number): string {
        const length = this.buffer.readUInt8(offset)

        return this.buffer.slice(offset + 1, offset + 1 + length).toString()
    }

    getTypeId(): FileType {
        let typeId = this.getRawTypeId()

        if (this.hasReference()) typeId -= FILE_REFERENCE_FLAG
        if (this.hasWebLocation()) typeId -= WEB_LOCATION_FLAG

        return typeId
    }

    getTypeName(): string {
        return typesNames[this.getTypeId()];
    }

    getDcId(): number {
        return this.buffer.readUInt32LE(0 + 4)
    }

    hasReference(): boolean {
        return (this.getRawTypeId() & FILE_REFERENCE_FLAG) !== 0;
    }

    hasWebLocation(): boolean {
        return (this.getRawTypeId() & WEB_LOCATION_FLAG) !== 0;
    }

    getWebUrl(): string {
        if (!this.hasWebLocation()) throw new Error('file hasn\t web location')

        return this.readTLString(0 + 4 + 4)
    }

    getFileReferense() { }

    getVersion(): number {
        return this.buffer.readUInt8(this.buffer.length - 1)
    }

    getSubVersion(): number {
        return this.buffer.readUInt8(this.buffer.length - 2)
    }
}
*/
/*
const test = internalDecode('CQACAgIAAxUAAWEeuhFFJdJHiK9uhkTEjATD_aEUAAJI8DUHAAITpm7HnD1qJZ2zIAQ')
console.log(test)
*/
import { WriteExtendedBuffer } from "./buffer";
import { encodeZeroBytes, writeTLBytes } from "./helpers";
import { FILE_REFERENCE_FLAG } from "./types";

export function internalEncode(params: {
    typeId: number,
    reference?: Buffer,
    dcId: number,
    id: bigint,
    access_hash: bigint
}) {
    const buffer = new WriteExtendedBuffer()

    let rawTypeId = params.typeId
    if(params.reference) rawTypeId += FILE_REFERENCE_FLAG

    buffer.writeInt32LE(rawTypeId)
    buffer.writeInt32LE(params.dcId)
    if(params.reference) writeTLBytes(buffer, params.reference)

    //TO DO WEB LOCATION
    buffer.writeBigInt64LE(params.id)
    buffer.writeBigInt64LE(params.access_hash)

    buffer.writeUInt8(32)
    buffer.writeUInt8(4)

    let outBuffer = buffer.toBuffer()

    outBuffer = encodeZeroBytes(outBuffer)

    return outBuffer.toString('base64url')
}

/*export class FileIDEncoder {

}*/
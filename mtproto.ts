import { createHash, randomBytes } from 'crypto'
import { config } from './config'
import { internalEncode } from './file_id'
import { FileType } from './file_id/types'
import { TelegramClient, Api } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { readBigIntFromBuffer } from 'telegram/Helpers'
import { Logger } from 'telegram/extensions'
import { cache, saveJSON } from './cache'

const session = new StringSession(cache.session)

const mtproto = new TelegramClient(session, config.api_id, config.api_hash, {
    connectionRetries: 5,
    baseLogger: new Logger('error')
})

mtproto.start({
    botAuthToken: config.tg_token
}).then(() => {
    console.log('MTProto started')
    cache.session = session.save()
    saveJSON()
}).catch((e) => {
    console.error('MTProto start error', e)
})

export type UploadProgress = {
    percent: number,
    now: number,
    total: number
}

export type UploadCallback = (params: UploadProgress) => void

export async function uploadAudioFile(buffer: Buffer, params: { name: string, title: string, performer: string, duration: number }, cb: UploadCallback = () => { }) {
    const partsCount: number = Math.ceil(buffer.length / 524288)

    const file_id = readBigIntFromBuffer(randomBytes(8), true, true)
    const isBig: boolean = buffer.length > 10 * 1024 * 1024

    const partSize = 524288

    const md5_hash = createHash('md5').update(buffer).digest('hex')

    function sendCb(part: number = 0) {
        const nowLength = Math.min(part * partSize, buffer.length)
        const percent = nowLength * 100 / buffer.length
        cb({ percent, now: nowLength, total: buffer.length })
    }

    sendCb()

    const sender = await mtproto._borrowExportedSender(mtproto.session.dcId)

    for (let part = 0; part < partsCount; part++) {
        const bufferPart: Buffer = buffer.slice(partSize * part, partSize * (part + 1))

        const res = await sender.send(isBig ? new Api.upload.SaveBigFilePart({
            fileId: file_id,
            filePart: part,

            fileTotalParts: partsCount,

            bytes: bufferPart
        }) : new Api.upload.SaveFilePart({
            fileId: file_id,
            filePart: part,

            bytes: bufferPart
        })) as Api.Bool

        sendCb(part + 1)
    }

    const result = await mtproto.invoke(new Api.messages.UploadMedia({
        peer: new Api.InputPeerSelf(),
        media: new Api.InputMediaUploadedDocument({
            file: isBig ? new Api.InputFileBig({
                id: file_id,
                parts: partsCount,
                name: params.name
            }) : new Api.InputFile({
                id: file_id,
                parts: partsCount,
                name: params.name,
                md5Checksum: md5_hash
            }),
            mimeType: 'audio/mpeg',
            attributes: [
                new Api.DocumentAttributeAudio({
                    title: params.title,
                    performer: params.performer,
                    duration: params.duration
                })
            ]
        })
    }))

    if (!(result instanceof Api.MessageMediaDocument)) throw new Error('api type error #1')

    if (!(result.document instanceof Api.Document)) throw new Error('api type error #2')

    const doc = result.document

    /*console.log({
        id: doc.id,
        access_hash: doc.accessHash
    }, {
        id: BigInt(doc.id.toString()),
        access_hash: BigInt(doc.accessHash.toString())
    })*/

    return {
        isBig,

        unique_file_id: BigInt(file_id.toString()),
        md5_hash,

        file: {
            id: BigInt(doc.id.toString()),
            access_hash: BigInt(doc.accessHash.toString()),
            file_reference: doc.fileReference,
            dc_id: doc.dcId
        },

        file_id: internalEncode({
            typeId: FileType.Audio,
            reference: doc.fileReference,
            dcId: doc.dcId,
            id: BigInt(doc.id.toString()),
            access_hash: BigInt(doc.accessHash.toString())
        })
    }
}

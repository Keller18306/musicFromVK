import { downloadFile } from './'
import { vk, getUserId } from '../vk'
import { DownloadCallback } from './downloadFile'
import { cacheAudio, cache, saveJSON } from '../cache'
import { readFileSync } from 'fs'
import { audioInfoParser } from './audioInfoParser'
import { formatBytes } from '../utils'

export async function getAudio(owner_id: null | number, id: number, access_key?: string, cb?: DownloadCallback): Promise<{
    name: string | null,
    source: Buffer,
    fulltitle: string,
    title: string,
    artist: string,
    duration: number,
    audioInfo: {
        size: number,
        kbps: number,
        khz: number,
        mode: string
    }
}> {
    if (owner_id == null) owner_id = await getUserId()

    const audio = `${owner_id}_${id}`

    //TO DO, cache access key to url cache

    const audioCache = cache.file[audio] || cache.url[audio]

    const [{ url, title, artist, duration }] = audioCache !== undefined ? [{ url: '', ...audioCache }] : undefined || await vk.api.audio.getById({
        audios: audio + (access_key ? `_${access_key}` : '')
    })

    if (url !== '') cacheAudio('url', audio, {
        title,
        artist,
        duration,
        url,
        access_key
    }, null)

    function getFromCache() {
        const buffer = readFileSync(`./downloaded/${cache.file[audio].file}`)
        return {
            buffer: buffer,
            name: null,
            error: null,
            size: buffer.length
        }
    }

    const { buffer, name, error, size } = cache.file[audio] === undefined ? await downloadFile(url, true, cb) : getFromCache()

    if (error === 404) {
        if (cache.url[audio] !== undefined) {
            delete cache.url[audio]
            saveJSON()
        }
        return getAudio(owner_id, id, access_key, cb)
    }

    if (name !== null) cacheAudio('file', audio, {
        title,
        artist,
        duration
    }, null, name)

    let audioInfo = { kbps: 0, khz: 0, mode: 'Parse error' }
    try {
        audioInfo = audioInfoParser(buffer)
    } catch (e) {
        console.error(e)
    }

    return {
        name: name,
        source: buffer,
        fulltitle: `${artist} - ${title}`,
        title, artist, duration,
        audioInfo: {
            size,
            kbps: audioInfo.kbps,
            khz: audioInfo.khz,
            mode: audioInfo.mode
        }
    }
}

import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { deepClone } from './utils'

type CacheUrl = {
    title: string
    artist: string
    duration: number
    url: string
    cacheUntil: null | number
}
type CacheFile = {
    title: string
    artist: string
    duration: number
    file: string
    cacheUntil: null | number
}
type CacheTelegram = {
    title: string
    artist: string
    duration: number
    file_id: string
    audioInfo: {
        size: number
        kbps: number
        khz: number
        mode: string
    }
    cacheUntil: null | number
}

export type JSONSchema = {
    telegram: {
        [audio: string]: CacheTelegram
    },
    file: {
        [audio: string]: CacheFile
    },
    url: {
        [audio: string]: CacheUrl
    }
}

function loadJSON() {
    const file = readFileSync('./cached.json').toString()

    const json: JSONSchema = JSON.parse(file)

    return json
}

export function saveJSON() {
    const data = JSON.stringify(json, null, 4)

    writeFileSync('./cached.json', data)
}

const json: JSONSchema = existsSync('./cached.json') ? loadJSON() : {
    telegram: {},
    file: {},
    url: {}
}
clearCache()
setInterval(clearCache, 1 * 60 * 60 * 1e3)

export function clearCache() {
    const time = new Date().getTime()

    saveJSON()
}

function getNewTime(type: false | 'url' | 'file' | 'telegram'): number {
    const time = new Date().getTime()

    switch (type) {
        case false:
            return time
        case 'url':
            return time + (1 * 60 * 60 * 1e3)
        case 'file':
            return time + (24 * 60 * 60 * 1e3)
        case 'telegram':
            return time + (7 * 24 * 60 * 60 * 1e3)
    }
}

export function getCacheAudio(audio: string) {
    if (json.telegram[audio] !== undefined) {
        json.telegram[audio].cacheUntil = getNewTime('telegram')
        saveJSON()
        return json.telegram[audio];
    }
    if (json.file[audio] !== undefined) {
        json.file[audio].cacheUntil = getNewTime('file')
        saveJSON()
        return Object.assign({}, [
            json.file[audio],
            { buffer: readFileSync(`./downloaded/${json.file[audio].file}`) }
        ])
    }
    if (json.url[audio] !== undefined) {
        json.url[audio].cacheUntil = getNewTime('url')
        saveJSON()
        return json.url[audio];
    }

    return undefined;
}

export function cacheAudio(type: 'url' | 'file' | 'telegram', audioId: string, audio: {
    title: string,
    artist: string,
    duration: number,
    audioInfo?: {
        size: number
        kbps: number
        khz: number
        mode: string
    },
    url?: string
}, until: null | number, file?: string): boolean {
    if (type === 'telegram') {
        if (file === undefined) throw new Error('file_id is undefined')
        if(audio.audioInfo === undefined) throw new Error('audioInfo is undefined')

        if (json.file[audioId] !== undefined) {
            unlinkSync(`./downloaded/${json.file[audioId].file}`)
            delete json.file[audioId]
        }
        if (json.url[audioId] !== undefined) delete json.url[audioId]
        

        json.telegram[audioId] = {
            title: audio.title,
            artist: audio.artist,
            duration: audio.duration,
            file_id: file,
            audioInfo: audio.audioInfo,
            cacheUntil: until
        }

        saveJSON()

        return true;
    }
    if (type === 'file') {
        if (json.telegram[audioId] !== undefined) return false;
        if (json.url[audioId] !== undefined) delete json.url[audioId]
        if (file === undefined) throw new Error('file is undefined')

        json.file[audioId] = {
            title: audio.title,
            artist: audio.artist,
            duration: audio.duration,
            file: file,
            cacheUntil: until
        }

        saveJSON()

        return true;
    }
    if (type === 'url') {
        if (json.file[audioId] !== undefined || json.telegram[audioId] !== undefined) return false;
        if (audio.url === undefined) throw new Error('url is undefined')
        if (audio.url === '') throw new Error('url is empty')

        json.url[audioId] = {
            title: audio.title,
            artist: audio.artist,
            duration: audio.duration,
            url: audio.url,
            cacheUntil: until
        }

        saveJSON()

        return true;
    }

    throw new Error('unknown type')
}

export function deleteAudioAllCache(audio: string): boolean {
    let res: boolean = false

    if (json.telegram[audio] !== undefined) {
        delete json.telegram[audio]
        res = true
    }
    if (json.file[audio] !== undefined) {
        unlinkSync(`./downloaded/${json.file[audio].file}`)
        delete json.file[audio]
        res = true
    }
    if (json.url[audio] !== undefined) {
        delete json.url[audio]
        res = true
    }

    if(res) saveJSON()

    return res;
}

export function copyCache(from: string, to: string) {
    if(json.telegram[from] !== undefined) {
        if(json.telegram[to] !== undefined) return false
        json.telegram[to] = deepClone(json.telegram[from]) as CacheTelegram
        saveJSON()
        return true
    }
    if(json.file[from] !== undefined) {
        if(json.file[to] !== undefined) return false
        json.file[to] = deepClone(json.file[from]) as CacheFile
        saveJSON()
        return true
    }
    if(json.url[from] !== undefined) {
        if(json.url[to] !== undefined) return false
        json.url[to] = deepClone(json.url[from]) as CacheUrl
        saveJSON()
        return true
    }

    return false
}

export function startCacheAudios() { }

export { json as cache }
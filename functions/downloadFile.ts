import { default as request } from 'request'
import { parse } from 'path'
import { writeFile } from 'fs/promises'
import { existsSync } from 'fs'

export type File = {
    name: string | null,
    buffer: Buffer,
    error: any,
    size: number
}

export type DownloadProgress = {
    percent: number,
    now: number,
    total: number
}

export type DownloadCallback = (params: DownloadProgress) => void

export async function downloadFile(url: string, save: boolean = true, cb: DownloadCallback = () => {}): Promise<File> {
    const name: string | null = url.match(/\/(\w+\.mp3)\?extra=/)?.[1] || null

    const { buffer, error, size }: { buffer: Buffer, error: any, size: number } = await new Promise(res => {
        const chunk: Buffer[] = []
        let nowLength: number = 0
        let totalLength: number = 0

        function sendCb() {
            const percent = nowLength * 100 / totalLength
            cb({ percent, now: nowLength, total: totalLength })
        }

        request(url)
            .on('response', (resp) => {
                if(resp.statusCode !== 200) {
                    return res({ buffer: Buffer.alloc(0), error: resp.statusCode, size: 0 })
                }
                totalLength = Number(resp.headers['content-length'])
                sendCb()
            })
            .on('data', (data: Buffer) => {
                nowLength += data.length
                chunk.push(data)
                sendCb()
            })
            .on('complete', () => {
                res({ buffer: Buffer.concat(chunk), error: null, size: totalLength })
            })
    })

    const savePath = `./downloaded/${name}`

    if (save && error === null && !existsSync(savePath)) await writeFile(savePath, buffer)

    return { name, buffer, error, size }
}


import { tg } from "../bot"
import { formatBytes } from "../utils"

export function getCaption(audio: string, audioInfo: {
    size: number
    kbps: number
    khz: number
    mode: string
}, watermark: boolean = true): string {
    const caption: string[] = [
        audio,
        `${formatBytes(audioInfo.size)} | ${audioInfo.kbps} kbps | ${audioInfo.khz} kHz`,
        audioInfo.mode
    ]

    if(watermark) caption.push(`<i>— via @${tg.botInfo?.username}</i>`)
    
    return caption.join('\n')
}
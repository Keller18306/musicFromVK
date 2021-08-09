import { InlineKeyboardButton } from "typegram";
import { AudioItem } from '../vk'

export function buildKeyboardAudio(audios: AudioItem[], method: string, page: number, payload: any[] = [], showDelete: boolean = false) {
    const keyboard: InlineKeyboardButton[][] = []

    const controlButtons: InlineKeyboardButton[] = [
        {
            text: '⬅️',
            callback_data: `changePage|${method}|${page-1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '🔄',
            callback_data: `changePage|${method}|${page}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: `${page}`,
            callback_data: `nothing|${method}|${page}`
        },
        {
            text: '🔽',
            callback_data: `getPage|${method}|${page}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '➡️',
            callback_data: `changePage|${method}|${page+1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        }
    ]

    keyboard.push(controlButtons)

    for (const song of audios) {
        const text: string = `${song.artist} - ${song.title}`

        keyboard.push([
            {
                text: text,
                callback_data: `getAudio|${song.owner_id}|${song.id}|${song.access_key}|${Number(showDelete)}`
            }
        ])
    }

    keyboard.push(controlButtons)

    return keyboard
}

export function buildKeyboardInAudio(owner_id: number, id: number, access_key: string, showDelete: boolean = false) {
    const keyboard: InlineKeyboardButton[][] = [
        [
            {
                text: '➕',
                callback_data: `addToMusic|${owner_id}|${id}|${access_key}`
            },
            {
                text: '🎶',
                callback_data: `getSimilar|${owner_id}|${id}|${access_key}`
            },
            {
                text: '✔️',
                callback_data: `sendStartEvent|${owner_id}|${id}|${access_key}`
            }
        ]
    ]

    if(showDelete) keyboard[0].unshift({
        text: '🗑',
        callback_data: `deleteMusic|${owner_id}|${id}`
    })

    return keyboard
}
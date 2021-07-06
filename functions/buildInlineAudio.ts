import { InlineKeyboardButton, InlineQueryResultAudio } from "typegram";
import { AudioItem } from '../vk'

export function buildInlineAudio(audios: AudioItem[], method: string, page: number, payload: any[] = []) {
    /*const inline: InlineQueryResultAudio[] = []

    for (const song of audios) {
        const text: string = `${song.artist} - ${song.title}`

        inline.push({})

        keyboard.push([
            {
                text: text,
                callback_data: `getAudio|${song.owner_id}|${song.id}`
            }
        ])
    }

    keyboard.push([
        {
            text: '⬅️',
            callback_data: `changePage|${method}|${page-1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '🔽',
            callback_data: `getPage|${method}|${page}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '➡️',
            callback_data: `changePage|${method}|${page+1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        }
    ])

    return keyboard*/
}
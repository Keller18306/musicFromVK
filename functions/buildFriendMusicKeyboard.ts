import { InlineKeyboardButton } from "typegram";
import { AudioItem } from '../vk'

export function buildFriendMusicKeyboard(audios: AudioItem[], page: number, payload: any[] = []) {
    const keyboard: InlineKeyboardButton[][] = []

    const controlButtons: InlineKeyboardButton[] = [
        {
            text: '⬅️',
            callback_data: `getFriend|${page-1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '🔄',
            callback_data: `getFriend|${page}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: `${page}`,
            callback_data: `nothing|getFriend|${page}`
        },
        {
            text: '🔽',
            callback_data: `getPage|getFriend|${page}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '➡️',
            callback_data: `getFriend|${page+1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        }
    ]

    keyboard.push(controlButtons)

    for (const song of audios) {
        const text: string = `${song.artist} - ${song.title}`

        keyboard.push([
            {
                text: text,
                callback_data: `getAudio|${song.owner_id}|${song.id}|0`
            }
        ])
    }

    keyboard.push(controlButtons)

    return keyboard
}

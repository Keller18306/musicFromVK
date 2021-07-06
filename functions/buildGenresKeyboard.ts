import { InlineKeyboardButton } from "typegram";
import { genres } from '../vk'

export function buildGenresKeyboard(columns: number = 2) {
    const keyboard: InlineKeyboardButton[][] = []

    const gList: [number, string][] = []
    for (const id in genres) {
        gList.push([+id, genres[+id]])
    }

    for (let row = 1; row <= Math.ceil(Object.keys(genres).length / columns); row++) {
        const rowKeyboard: InlineKeyboardButton[] = []
        for (let column = 1; column <= columns; column++) {
            const [genre] = gList.splice(0, 1)
            if(genre === undefined) continue;
            rowKeyboard.push({
                text: genre[1],
                callback_data: `changePage|getPopular|1|${genre[0]}`
            })
        }
        keyboard.push(rowKeyboard)
    }

    return keyboard
}

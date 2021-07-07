import { InlineKeyboardButton } from "typegram";
import { UsersUserFull } from "vk-io/lib/api/schemas/objects";

export function buildFriendsKeyboard(friends: UsersUserFull[], page: number, payload: any[] = []) {
    const keyboard: InlineKeyboardButton[][] = []

    const controlButtons: InlineKeyboardButton[] = [
        {
            text: '⬅️',
            callback_data: `changePage|getFriends|${page-1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: '🔄',
            callback_data: `changePage|getFriends|${page}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        },
        {
            text: `${page}`,
            callback_data: `nothing|getFriends|${page}`
        },
        {
            text: '➡️',
            callback_data: `changePage|getFriends|${page+1}${payload.length > 0 ? '|' : ''}${payload.join('|')}`
        }
    ]

    keyboard.push(controlButtons)

    for (const friend of friends) {
        const text: string = `${friend.first_name} ${friend.last_name}`

        keyboard.push([
            {
                text: text,
                callback_data: `getFriend|1|${friend.id}`
            }
        ])
    }

    keyboard.push(controlButtons)

    return keyboard
}

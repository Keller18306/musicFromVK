import { vk, getUserId } from '../vk'
import { UsersUserFull } from 'vk-io/lib/api/schemas/objects'
import { buildFriendsKeyboard } from './'

export async function getFriends(owner_id: number | null, page: number = 1, count: number = 10) {
    if (owner_id == null) owner_id = await getUserId()

    const { count: vkCount, items } = await vk.api.friends.get({
        user_id: owner_id,
        offset: (page - 1) * count,
        count: count
    })

    const users = await vk.api.users.get({ user_ids: items.join(',') })

    const pages: number = Math.ceil(vkCount / count)

    const selected: UsersUserFull[] = users.splice(0, count)

    const keyboard = buildFriendsKeyboard(selected, page, [
        owner_id
    ])

    return {
        keyboard,
        page,
        pages
    }
}
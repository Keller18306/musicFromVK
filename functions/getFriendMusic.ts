import { vk, AudioItem } from '../vk'
import { cacheAudio } from '../cache'
import { buildFriendMusicKeyboard } from './'
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram'

export async function getFriendMusic(friend_id: number, page: number = 1, count: number = 10): Promise<{ success: boolean | string, keyboard: InlineKeyboardButton[][], page: number, pages: number, audios: { owner_id: number, id: number }[] }> {
    let success: true | string = true

    const {
        count: vkCount,
        items: music
    }: {
        count: number,
        items: AudioItem[]
    } = await vk.api.audio.get({
        owner_id: friend_id,
        offset: (page - 1) * count,
        count: count
    }).catch((err) => {
        if (err.code == 201) {
            success = err.toString()
            return { count: 0, items: [] };
        }
        throw new Error(err.toString())
    })

    const pages: number = Math.ceil(vkCount / count)

    const selected: AudioItem[] = music.splice(0, count)

    const keyboard = buildFriendMusicKeyboard(selected, page, [
        friend_id
    ])

    const audios: {
        owner_id: number,
        id: number
    }[] = []

    for (const audio of selected) {
        if (audio.url !== '') cacheAudio('url', `${audio.owner_id}_${audio.id}`, {
            title: audio.title,
            artist: audio.artist,
            duration: audio.duration,
            url: audio.url
        }, null)

        audios.push({
            owner_id: audio.owner_id,
            id: audio.id
        })
    }

    return { success, keyboard, page, pages, audios }
}
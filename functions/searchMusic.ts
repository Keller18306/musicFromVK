import { buildKeyboardAudio } from './'
import { vk, AudioItem } from '../vk'
import { cacheAudio } from '../cache'

export async function searchMusic(q: string, page: number = 1, count: number = 10, id: number) {
    const {
        count: vkCount,
        items: music
    } = await vk.api.audio.search({
        q: q,
        offset: (page - 1) * count,
        count: count
    })

    const pages: number = Math.ceil(vkCount / count)

    const selected: AudioItem[] = music.splice(0, count)

    const keyboard = buildKeyboardAudio(selected, 'searchMusic', page, [
        id
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

    return { keyboard, page, pages, audios }
}
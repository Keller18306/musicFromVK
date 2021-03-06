import { buildKeyboardAudio } from '.'
import { cacheAudio } from '../cache'
import { vk, AudioItem, getUserId } from '../vk'

export async function getRecommendations(page: number = 1, count: number = 10) {
    const {
        count: vkCount,
        items: music
    } = await vk.api.audio.getRecommendations({
        offset: (page - 1) * count,
        count: count
    })

    const pages: number = Math.ceil(vkCount / count)

    const selected: AudioItem[] = music.splice(0, count)

    const keyboard = buildKeyboardAudio(selected, 'getRecommendations', page)

    const audios: {
        owner_id: number,
        id: number,
        access_key: string
    }[] = []

    for (const audio of selected) {
        if (audio.url !== '') cacheAudio('url', `${audio.owner_id}_${audio.id}`, {
            title: audio.title,
            artist: audio.artist,
            duration: audio.duration,
            url: audio.url,
            access_key: audio.access_key
        }, null)
        audios.push({
            owner_id: audio.owner_id,
            id: audio.id,
            access_key: audio.access_key
        })
    }

    return {
        keyboard,
        page,
        pages,
        audios
    }
}
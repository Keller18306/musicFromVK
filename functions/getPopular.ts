import { buildKeyboardAudio } from './'
import { vk, AudioItem, getUserId } from '../vk'
import { cacheAudio } from '../cache'

export async function getPopular(id: number | null | undefined, page: number = 1, count: number = 10) {
    if(id === null) id = undefined

    const music = await vk.api.audio.getPopular({
        genre_id: id,
        offset: (page - 1) * count,
        //count var disabled (vk bug)
        count: 1000
    })

    const pages: number = Math.ceil(music.length / count)

    const selected: AudioItem[] = music.splice(0, count)

    const keyboard = buildKeyboardAudio(selected, 'getPopular', page, id === undefined ? undefined : [
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

    return {
        keyboard,
        page,
        pages,
        audios
    }
}
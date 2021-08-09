import { buildKeyboardAudio } from './'
import { vk, AudioItem, getUserId } from '../vk'
import { cacheAudio } from '../cache'

export async function getPlaylist(owner_id: number | null, id: number, page: number = 1, count: number = 10) {
    if (owner_id == null) owner_id = await getUserId()

    const [playlist, music] = await Promise.all([
        vk.api.audio.getPlaylistById({
            playlist_id: id,
            owner_id: owner_id
        }),
        vk.api.audio.get({
            playlist_id: id,
            owner_id: owner_id,
            offset: (page - 1) * count,
            count: count
        })
    ])

    const pages: number = Math.ceil(music.count / count)

    const selected: AudioItem[] = music.items.splice(0, count)

    const keyboard = buildKeyboardAudio(selected, 'getPlaylist', page, [
        owner_id,
        id
    ])

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
            url: audio.url
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
        title: playlist.title,
        subtitle: playlist.subtitle,
        audios
    }
}
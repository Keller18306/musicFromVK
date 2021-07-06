import { VK, API } from 'vk-io'
import { config } from './config'

export type Flag = 0 | 1

export type AudioItem = {
    artist: string
    id: number
    owner_id: number
    title: string
    duration: number
    access_key: string
    ads: {
        content_id: string
        duration: string
        account_age_type: string
        puid22: string
    }
    is_explicit: boolean
    is_focus_track: boolean
    is_licensed: boolean
    track_code: string
    url: string
    date: number
    album: {
        id: number
        title: string
        owner_id: number
        access_key: string
        thumb: {
            width: number
            height: number
            photo_34: string
            photo_68: string
            photo_135: string
            photo_270: string
            photo_300: string
            photo_600: string
            photo_1200: string
        }
    }
    short_videos_allowed: boolean
    stories_allowed: boolean
    stories_cover_allowed: boolean
    [key: string]: any
}

//all ?
export type AudioGetParams = {
    owner_id?: number
    album_id?: number
    playlist_id?: number
    audio_ids?: number
    need_user?: boolean | Flag
    offset?: number
    count?: number
    [key: string]: any
}

export type AudioAddParams = {
    audio_id: number
    owner_id: number
    group_id?: number
}

export type AudioGetByIdParams = {
    audios: string
    [key: string]: any
}

export type AudioDeleteParams = {
    audio_id: number
    owner_id: number
}

export type AudioSearchParams = {
    q: string
    auto_complete?: boolean | Flag
    lyrics?: boolean | Flag
    performer_only?: boolean | Flag
    sort?: '0' | '1' | '2'
    search_own?: boolean | Flag
    offset?: number
    count?: number
}

export type AudioGetPlaylistByIdParams = {
    owner_id: number
    playlist_id: number
    [key: string]: any
}

export type AudioGetRecommendationsParams = {
    offset?: number
    count?: number
    [key: string]: any
}

export type AudioSendStartEventParams = {
    uuid: string
    audio_id: string
}

export type AudioGetResponse = {
    count: number
    items: AudioItem[]
    [key: string]: any
}

export type AudioAddResponse = number

export type AudioGetByIdResponse = AudioItem[]

export type AudioDeleteResponse = 1

export type AudioSearchResponse = {
    [key: string]: any
}

export type AudioGetPlaylistByIdResponse = {
    id: number
    owner_id: number
    type: number
    title: string
    description: string
    count: number
    followers: number
    plays: number
    create_time: number
    update_time: number
    genres: any[],
    is_following: boolean
    photo: {
        width: number
        height: number
        photo_34: string
        photo_68: string
        photo_135: string
        photo_270: string
        photo_300: string
        photo_600: string
        photo_1200: string
    },
    access_key: string
    subtitle: string,
    album_type: string,
    meta: {
        view: string
    }
    [key: string]: any
}

export type AudioGetRecommendationsResponse = {
    count: number
    items: AudioItem[]
}

export type AudioSendStartEventResponse = {
    has_music_subscription: Flag
}

interface NewAPI extends API {
    audio: {
        add(params: AudioAddParams): Promise<AudioAddResponse>
        get(params: AudioGetParams): Promise<AudioGetResponse>
        getById(params: AudioGetByIdParams): Promise<AudioGetByIdResponse>
        delete(params: AudioDeleteParams): Promise<AudioDeleteResponse>
        search(params: AudioSearchParams): Promise<AudioSearchResponse>
        getPlaylistById(params: AudioGetPlaylistByIdParams): Promise<AudioGetPlaylistByIdResponse>,
        getRecommendations(params: AudioGetRecommendationsParams): Promise<AudioGetRecommendationsResponse>,
        sendStartEvent(params: AudioSendStartEventParams): Promise<AudioSendStartEventResponse>
    }
}

interface NewVK extends VK {
    api: NewAPI
}

const vk = new VK({
    token: config.vk_token,
    apiMode: 'parallel_selected',
    apiExecuteMethods: [
        'users.get',
        'audio.get', 'audio.getById',
        'audio.search',
        'audio.getPlaylistById',
        'audio.getRecommendations'
    ]
}) as NewVK

let myVkID: null | number = null
export async function getUserId(): Promise<number> {
    return myVkID !== null ? myVkID : vk.api.users.get({}).then(
        ([res]) => {
            myVkID = res.id
            return res.id
        }
    )
}

export { vk }
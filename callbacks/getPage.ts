import { default as BaseCallback, HandlerParams } from './_base'
import { downloadFile, getAccountMusic, getAudio, getCaption, getPlaylist, getRecommendations, searchMusic, getPopular, getFriendMusic } from '../functions'
import { searchId } from '../bot'
import { vk } from '../vk'
import { InputMediaAudio, Message } from 'telegraf/typings/core/types/typegram'
import { getUserPermissions, noPerm, Permission } from '../permissions'
import { formatBytes } from '../utils'
import { cacheAudio, cache } from '../cache'
import { uploadAudioFile } from '../mtproto'

export default class Callback extends BaseCallback {
    public id: string | null = 'getPage'

    public permission: Permission = 'bot.get.page'

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('|')

        const parsed: {
            id: string,
            method: string,
            page: number
        } = {
            id: arg[0],
            method: arg[1],
            page: Number(arg[2])
        }

        return parsed
    }

    async handler({ tg, ctx, payload }: HandlerParams) {
        const args = payload.split('|')
        const { method, page } = this.payloadParser(payload)

        if (isNaN(page)) return;
        if (page <= 0) return ctx.answerCbQuery()

        let audios: {
            owner_id: number,
            id: number,
            access_key?: string,
            status?: string
        }[] = []

        switch (method) {
            case 'getMusic':
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.music'))
                    return noPerm(ctx, 'bot.get.music', 'action')

                audios = (await getAccountMusic(page, 10)).audios
                break;

            case 'getPlaylist': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.playlist'))
                    return noPerm(ctx, 'bot.get.playlist', 'action')

                const owner_id = Number(args[3])
                const id = Number(args[4])

                if (isNaN(owner_id)) return;
                if (isNaN(id)) return;

                audios = (await getPlaylist(owner_id, id, page, 10)).audios
                break;
            }

            case 'searchMusic': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.search.music'))
                    return noPerm(ctx, 'bot.search.music', 'action')

                const id = Number(args[3])

                if (isNaN(id)) return;

                const q = searchId[id]
                if (q === undefined) return ctx.answerCbQuery('Время жизни этого поиска закончилось', { show_alert: true })

                audios = (await searchMusic(q, page, 10, id)).audios
                break;
            }

            case 'getRecommendations':
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.recommendations'))
                    return noPerm(ctx, 'bot.get.recommendations', 'action')

                audios = (await getRecommendations(page, 10)).audios
                break;

            case 'getPopular': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.popular'))
                    return noPerm(ctx, 'bot.get.popular', 'action')

                const id = args[3] == null ? undefined : Number(args[3])

                audios = (await getPopular(id, page, 10)).audios
                break;
            }

            case 'getFriend': {
                if (!getUserPermissions(ctx.callbackQuery.from.id).permissions.includes('bot.get.friends'))
                    return noPerm(ctx, 'bot.get.friends', 'action')

                if (args[3] == null) return;
                const id = Number(args[3])

                audios = (await getFriendMusic(id, page, 10)).audios
                break;
            }
        }

        if (audios.length === 0) return;

        const message = await ctx.reply('Инициализация...')
        let lastMessage: string = '';
        let noUpdate: boolean = false

        async function updateStatus() {
            if (noUpdate) return;
            const statuses: string[] = []

            for (const i in audios) {
                const audio = audios[i]
                const status = audio.status || 'Инициализация...'
                statuses.push(`${+i + 1}. ` + status)
            }

            const newMessage: string = statuses.join('\n')

            if (lastMessage === newMessage) return;
            lastMessage = newMessage

            return ctx.tg.editMessageText(message.chat.id, message.message_id, '', newMessage).catch((err) => {
                if (err.response.error_code === 429) {
                    noUpdate = true
                    return;
                }
                console.error('update status error:', err.toString())
            })
        }

        await updateStatus()
        const infoInterval: NodeJS.Timeout = setInterval(updateStatus, 500)

        async function setStatus() {
            return ctx.tg.sendChatAction(ctx.chat!.id, 'upload_document').catch(() => { })
        }
        setStatus()
        const send_status: NodeJS.Timeout = setInterval(setStatus, 4e3)

        const promises: Promise<any>[] = []
        const media: (InputMediaAudio | null)[] = []

        for (const i in audios) {
            media.push(null)
            const audio = audios[i]

            function status(text: string) {
                audio.status = text
            }

            const cached = cache.telegram[`${audio.owner_id}_${audio.id}`]
            if (cached === undefined) {
                const promise = (async () => {
                    status('Начало скачивания из ВК...')
                    const { name, title, artist, duration, source, audioInfo } = await getAudio(audio.owner_id, audio.id, audio.access_key, ({ percent, now, total }) => {
                        status(`Скачивание из ВК [${percent.toFixed(2)}%] (${formatBytes(now)}/${formatBytes(total)})...`)
                    })

                    status('Начало загрузки в Telegram')
                    const { file_id } = await uploadAudioFile(source, {
                        name: name || 'noname.mp3',
                        title: title,
                        performer: artist,
                        duration: duration
                    }, ({ percent, now, total }) => {
                        status(`Загрузка в Telegram [${percent.toFixed(2)}%] (${formatBytes(now)}/${formatBytes(total)})...`)
                    })

                    cacheAudio('telegram', `${audio.owner_id}_${audio.id}`, {
                        title: title,
                        artist: artist,
                        duration: duration,
                        audioInfo: audioInfo
                    }, null, file_id)

                    media[i] = {
                        type: 'audio',
                        media: file_id,
                        title: title,
                        performer: artist,
                        duration: duration,
                        //отключено, т.к. это выглядит ужасно
                        //caption: getCaption(`${audio.owner_id}_${audio.id}`, audio.audioInfo!),
                        //parse_mode: 'HTML'
                    }

                    status('Завершено.')
                })()

                promises.push(promise)
            } else {
                media[i] = {
                    type: 'audio',
                    media: cached.file_id,
                    title: cached.title,
                    performer: cached.artist,
                    duration: cached.duration,
                    //отключено, т.к. это выглядит ужасно
                    //caption: getCaption(`${audio.owner_id}_${audio.id}`, audio.audioInfo!),
                    //parse_mode: 'HTML'
                }

                status('Завершено.')
            }
        }

        await Promise.all(promises)

        clearInterval(infoInterval)
        await updateStatus()

        if (media.includes(null)) throw new Error('some file is not uploaded')

        await ctx.replyWithMediaGroup(media as InputMediaAudio[])

        clearInterval(send_status)

        await new Promise(res => setTimeout(res, 3e3))

        ctx.tg.deleteMessage(message.chat.id, message.message_id)
    }
}
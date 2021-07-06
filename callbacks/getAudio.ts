import { default as BaseCallback, HandlerParams } from './_base'
import { buildKeyboardInAudio, getAudio, getCaption } from '../functions'
import { Permission } from '../permissions'
import { cache, cacheAudio } from '../cache'

export default class Callback extends BaseCallback {
    public id: string | null = 'getAudio'

    public permission: Permission = 'bot.get.audio'

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('|')

        const parsed: {
            id: string,
            owner_id: number,
            audio_id: number,
            showDelete: boolean
        } = {
            id: arg[0],
            owner_id: Number(arg[1]),
            audio_id: Number(arg[2]),
            showDelete: Boolean(+arg[3])
        }

        return parsed
    }

    async handler({ tg, ctx, payload }: HandlerParams) {
        const { owner_id, audio_id: id, showDelete } = this.payloadParser(payload)

        if (isNaN(owner_id)) return;
        if (isNaN(id)) return;

        let send_status: NodeJS.Timeout | null = null;

        async function setStatus() {
            return ctx.telegram.sendChatAction(ctx.from!.id, 'upload_document').catch(() => { })
        }

        if (typeof ctx.from?.id == 'number') {
            setStatus()
            send_status = setInterval(setStatus, 4e3)
        }

        const audio = `${owner_id}_${id}`
        const cached = cache.telegram[audio]

        const keyboard = buildKeyboardInAudio(owner_id, id, showDelete)

        if (cached === undefined) {
            const { source, title, artist, duration, audioInfo } = await getAudio(owner_id, id)

            const res = await ctx.replyWithAudio({
                source: source
            }, {
                title: title,
                performer: artist,
                duration: duration,
                caption: getCaption(audio, audioInfo),
                reply_markup: {
                    inline_keyboard: keyboard
                },
                parse_mode: 'HTML'
            })

            cacheAudio('telegram', audio, {
                title: title,
                artist: artist,
                duration: duration,
                audioInfo: audioInfo
            }, null, res.audio.file_id)
        } else {
            ctx.replyWithAudio(cached.file_id, {
                title: cached.title,
                performer: cached.artist,
                duration: cached.duration,
                caption: getCaption(audio, cached.audioInfo),
                reply_markup: {
                    inline_keyboard: keyboard
                },
                parse_mode: 'HTML'
            })
        }

        if (send_status != null) clearInterval(send_status)

        ctx.answerCbQuery().catch(() => { })
    }
}
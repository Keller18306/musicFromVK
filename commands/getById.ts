import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { callbacks } from '../bot'
import { buildKeyboardInAudio, getAudio, getCaption } from '../functions'
import { Permission } from '../permissions'
import { cache, cacheAudio } from '../cache'
import { uploadAudioFile } from '../mtproto'

export default class CMD extends BaseCommand {
    public id = 'getById'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'getById',
            description: 'Получает аудиозапись по идентификатору'
        }
    ]

    public messages: Message[] = []

    public permission: Permission = 'bot.get.audio'

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('_')

        const parsed: {
            owner_id: number,
            audio_id: number,
            access_key: string
        } = {
            owner_id: Number(arg[0]),
            audio_id: Number(arg[1]),
            access_key: arg[2]
        }

        return parsed
    }

    async handler({ tg, ctx, setList }: HandlerParams) {
        const payload = ctx.message.text.split(' ').slice(1).join(' ')

        if(payload === '') return ctx.reply('audio is empty')

        const { owner_id, audio_id: id, access_key } = this.payloadParser(payload)

        if (isNaN(owner_id)) return ctx.reply('owner_id is invalid');
        if (isNaN(id)) return ctx.reply('audio_id is invalid');

        let send_status: NodeJS.Timeout | null = null;

        async function setStatus() {
            return ctx.telegram.sendChatAction(ctx.from!.id, 'upload_document').catch(() => { })
        }

        if (typeof ctx.from?.id == 'number') {
            setStatus()
            send_status = setInterval(setStatus, 4e3)
            setList.setIntervals.push(send_status)
        }

        const audio = `${owner_id}_${id}`
        let cached = cache.telegram[audio]

        const keyboard = buildKeyboardInAudio(owner_id, id, access_key)

        if (cached === undefined) {
            const { source, name, title, artist, duration, audioInfo } = await getAudio(owner_id, id, access_key)

            const { file_id } = await uploadAudioFile(source, {
                name: name || 'noname.mp3',
                title: title,
                performer: artist,
                duration: duration
            })

            cacheAudio('telegram', audio, {
                title: title,
                artist: artist,
                duration: duration,
                audioInfo: audioInfo
            }, null, file_id)

            cached = cache.telegram[audio]
        }

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

        if (send_status != null) clearInterval(send_status)
    }
}
import { default as BaseCallback, HandlerParams } from './_base'
import { buildKeyboardInAudio, getAudio } from '../functions'
import { Permission } from '../permissions'
import { cache, cacheAudio, copyCache } from '../cache'
import { getUserId, vk } from '../vk'

export default class Callback extends BaseCallback {
    public id: string | null = 'addToMusic'

    public permission: Permission = 'bot.add.to.music'

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('|')

        const parsed: {
            id: string,
            owner_id: number,
            audio_id: number
        } = {
            id: arg[0],
            owner_id: Number(arg[1]),
            audio_id: Number(arg[2])
        }

        return parsed
    }

    async handler({ tg, ctx, payload }: HandlerParams) {
        const { owner_id, audio_id } = this.payloadParser(payload)

        if (isNaN(owner_id)) return;
        if (isNaN(audio_id)) return;

        const res: true | string = await vk.api.audio.add({
            audio_id, owner_id
        }).then(async (new_id) => {
            const old_audio = `${owner_id}_${audio_id}`
            const audio = `${await getUserId()}_${new_id}`
            copyCache(old_audio, audio)
            return true
        }).catch((err) => {
            return err.toString()
        })

        ctx.answerCbQuery(
            res === true ?
                'Аудиозапись успешно добавлена' :
                res,
            {
                show_alert: res !== true
            }
        ).catch(() => { })
    }
}
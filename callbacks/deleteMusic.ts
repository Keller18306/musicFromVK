import { default as BaseCallback, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { getUserId, vk } from '../vk'
import { randomBytes } from 'crypto'
import { deleteAudioAllCache } from '../cache'

export default class Callback extends BaseCallback {
    public id: string | null = 'deleteMusic'

    public permission: Permission = 'bot.delete.music'

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

        if (owner_id != await getUserId()) return ctx.answerCbQuery(
            'Вы не владелец этой аудиозаписи',
            {
                show_alert: true
            })

        const res: true | string = await vk.api.audio.delete({
            owner_id, audio_id
        }).then(() => {
            return true
        }).catch((err) => {
            return err.toString()
        })

        if(res === true) {
            deleteAudioAllCache(`${owner_id}_${audio_id}`)
            ctx.deleteMessage()
        }

        ctx.answerCbQuery(
            res === true ?
                'Аудиозапись удалена' :
                res,
            {
                show_alert: res !== true
            }
        ).catch(() => { })
    }
}
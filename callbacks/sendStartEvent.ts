import { default as BaseCallback, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { vk } from '../vk'
import { randomBytes } from 'crypto'

export default class Callback extends BaseCallback {
    public id: string | null = 'sendStartEvent'

    public permission: Permission = 'bot.send.start.event'

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('|')

        const parsed: {
            id: string,
            owner_id: number,
            audio_id: number,
            access_key: string
        } = {
            id: arg[0],
            owner_id: Number(arg[1]),
            audio_id: Number(arg[2]),
            access_key: arg[3]
        }

        return parsed
    }

    async handler({ tg, ctx, payload }: HandlerParams) {
        const { owner_id, audio_id, access_key } = this.payloadParser(payload)

        if (isNaN(owner_id)) return;
        if (isNaN(audio_id)) return;

        const res: true | string = await vk.api.audio.sendStartEvent({
            uuid: randomBytes(20).toString('hex'),
            audio_id: `${owner_id}_${audio_id}` + (access_key && access_key != '' ? `_${access_key}` : '')
        }).then(() => {
            return true
        }).catch((err) => {
            return err.toString()
        })

        ctx.answerCbQuery(
            res === true ?
                'Cобытие о прослушивании успешно отправлено' :
                res,
            {
                show_alert: res !== true
            }
        ).catch(() => { })
    }
}
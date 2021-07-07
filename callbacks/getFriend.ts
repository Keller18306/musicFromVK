import { default as BaseCallback, HandlerParams } from './_base'
import { buildKeyboardInAudio, getAudio, getCaption, getFriendMusic } from '../functions'
import { Permission } from '../permissions'
import { cache, cacheAudio } from '../cache'

export default class Callback extends BaseCallback {
    public id: string | null = 'getFriend'

    public permission: Permission = 'bot.get.friends'

    constructor() {
        super()
    }

    payloadParser(payload: string) {
        const arg = payload.split('|')

        const parsed: {
            id: string,
            page: number,
            friend_id: number
        } = {
            id: arg[0],
            page: Number(arg[1]),
            friend_id: Number(arg[2])
        }

        return parsed
    }

    async handler({ tg, ctx, payload }: HandlerParams) {
        const { page, friend_id } = this.payloadParser(payload)

        const { success, keyboard, pages } = await getFriendMusic(friend_id, page, 10)

        if(typeof success === 'string') {
            ctx.answerCbQuery(success, {
                show_alert: true
            })
            return;
        }

        ctx.editMessageText(`${page}/${pages}`, {
            reply_markup: {
                inline_keyboard: keyboard
            }
        }).then((r) => {
            ctx.answerCbQuery().catch(() => { })
            return r
        }, (e) => {
            if (e.response.error_code === 400) return ctx.answerCbQuery().catch(() => { })
            console.error(e)
        })
    }
}
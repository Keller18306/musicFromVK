import { default as BaseCallback, HandlerParams } from './_base'
import { Permission } from '../permissions'

export default class Callback extends BaseCallback {
    public id: string | null = 'nothing'

    public permission: Permission = 'bot.base.commands'

    constructor() {
        super()
    }

    payloadParser() {
        return {}
    }

    handler({ tg, ctx, payload }: HandlerParams) {
        ctx.answerCbQuery().catch(() => { })
    }
}
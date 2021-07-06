import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'ping'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'ping',
            description: 'Проверяет работоспособноть бота и задержки к серверам Telegram'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const ping: [number, number] = [0, 0]

        const sendPingStart = new Date().getTime()
        const message = await ctx.reply('Pong (send:wait|update:wait)')
        const sendPingEnd = new Date().getTime()
        ping[0] = sendPingEnd-sendPingStart

        const updatePingStart = new Date().getTime()
        await ctx.tg.editMessageText(message.chat.id, message.message_id, undefined, `Pong (send:${ping[0]}ms|update:wait)`)
        const updatePingEnd = new Date().getTime()
        ping[1] = updatePingEnd-updatePingStart

        ctx.tg.editMessageText(message.chat.id, message.message_id, undefined, `Pong (send:${ping[0]}ms|update:${ping[1]}ms)`)
    }
}
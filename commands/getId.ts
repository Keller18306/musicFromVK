import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getId'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'id',
            description: 'Получает id текущего аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'getId',
            description: 'Получает id текущего аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'myId',
            description: 'Получает id текущего аккаунта'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        return ctx.reply(`${ctx.message.from.id}`)
    }
}
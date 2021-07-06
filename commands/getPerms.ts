import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission, Permissions } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getPerms'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'getPerms',
            description: 'Узнать все разрешения'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        return ctx.reply(Permissions.join(', '))
    }
}
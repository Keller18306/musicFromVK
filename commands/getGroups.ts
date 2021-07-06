import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { groups, Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getGroups'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: true,
            command: 'getGroups',
            description: 'Узнать все группы'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        return ctx.reply(Object.keys(groups).join(', '))
    }
}
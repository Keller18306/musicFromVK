import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { getUserPermissions, Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'myGroup'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'myGroup',
            description: 'Узнать вашу текущую группу'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        const { group } = getUserPermissions(ctx.message.from.id)
        return ctx.reply(`Ваша группа: ${group}`)
    }
}
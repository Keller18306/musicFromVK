import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { getUserPermissions, Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'myPermissions'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'myPermissions',
            description: 'Узнать ваши текущие права'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'myPerms',
            description: 'Узнать ваши текущие права'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'myPerm',
            description: 'Узнать ваши текущие права'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        const { permissions } = getUserPermissions(ctx.message.from.id)
        return ctx.reply(`Ваши права:\n${permissions.join(', ')}`)
    }
}
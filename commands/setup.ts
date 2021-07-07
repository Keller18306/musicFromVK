import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission, setupKey, setUserGroup } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'setup'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: true,
            registerTG: false,
            command: 'setup',
            description: 'Первоначальная настройка прав администратора'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        if(setupKey === null) return;

        const key: string = ctx.message.text.split(' ')[1]
        if(key !== setupKey) return ctx.reply('Неверный ключ')

        const id: number = ctx.from.id

        setUserGroup(id, 'admin')
        ctx.reply('ok')
    }
}
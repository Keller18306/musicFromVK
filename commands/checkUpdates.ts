import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { checkUpdate } from '../functions'

export default class CMD extends BaseCommand {
    public id = 'checkUpdate'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'checkUpdate',
            description: 'Проверяет наличие новой версии бота'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'checkUpdates',
            description: 'Проверяет наличие новой версии бота'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    async handler({ tg, ctx }: HandlerParams) {
        const { found, current, last } = await checkUpdate()

        ctx.reply(
            (found ?
                'Доступна новая версия!' : 'Обновлений не найдено') +
                '\n\n' +
                `Текущая версия: ${current}` +
                found ? `\nНовая версия: ${last}` : ''
        )
    }
}
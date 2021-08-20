import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { cache } from '../cache'
import { mkdirSync, statSync } from 'fs'
import { formatBytes } from '../utils'

export default class CMD extends BaseCommand {
    public id = 'cacheStatus'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'cacheStatus',
            description: 'Информация о кэше бота'
        }
    ]

    public permission: Permission = 'bot.base.commands'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        const cacheSize = statSync('cached.json').size

        const info: string[] = [
            'В кэше закэшированно:\n'+
            `Telegram: ${Object.keys(cache.telegram).length}\n`,
            `Файлов: ${Object.keys(cache.file).length}\n`,
            `Ссылок: ${Object.keys(cache.url).length}\n`,
            `\nСессия MTProto сохранена: ${cache.session.length > 0 ? 'да' : 'нет'}\n`,
            `\nРазмер файла кэша: ${formatBytes(cacheSize)}`
        ]

        ctx.reply(info.join(''))
    }
}
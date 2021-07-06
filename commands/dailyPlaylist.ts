import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getPlaylist'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'dailyPlaylist'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getDaily',
            description: 'Получает дневной плейлист с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'getEvery',
            description: 'Получает дневной плейлист с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'daily',
            description: 'Получает дневной плейлист с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'every',
            description: 'Получает дневной плейлист с аккаунта'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Дневной плейлист'
        },
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Ежедневный плейлист'
        }
    ]

    public permission: Permission = 'bot.get.playlist'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx, -21)
    }
}
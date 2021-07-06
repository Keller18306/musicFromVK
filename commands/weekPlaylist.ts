import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getPlaylist'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'weekPlaylist'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getWeek',
            description: 'Получает недельный плейлист с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'week',
            description: 'Получает недельный плейлист с аккаунта'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Недельный плейлист'
        }
    ]

    public permission: Permission = 'bot.get.playlist'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx, -22)
    }
}
import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getPlaylist'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'newPlaylist'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getNew',
            description: 'Получает плейлист с новинками с аккаунта'
        },
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: false,
            command: 'new',
            description: 'Получает плейлист с новинками с аккаунта'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Новинки'
        },
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Плейлист с новинками'
        }
    ]

    public permission: Permission = 'bot.get.playlist'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx, -23)
    }
}
import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getMusic'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getMusic'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getMusic',
            description: 'Получает всю музыку с аккаунта'
        }
    ]

    public messages: Message[] = [
        {
            caseSensitive: false,
            startsWith: false,
            message: 'Моя музыка'
        }
    ]

    public permission: Permission = 'bot.get.music'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx)
    }
}
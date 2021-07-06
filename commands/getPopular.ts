import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { Permission } from '../permissions'
import { exec } from '../methods/getPopular'

export default class CMD extends BaseCommand {
    public id = 'getPopular'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getPopular',
            description: 'Получает популярную музыку'
        }
    ]

    public permission: Permission = 'bot.get.popular'

    public messages: Message[] = []

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx)
    }
}
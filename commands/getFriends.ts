import { default as BaseCommand, Message, Command, HandlerParams } from './_base'
import { exec } from '../methods/getFriends'
import { Permission } from '../permissions'

export default class CMD extends BaseCommand {
    public id = 'getFriends'

    public commands: Command[] = [
        {
            caseSensitive: false,
            startsWith: false,
            registerTG: true,
            command: 'getFriends',
            description: 'Возвращает список друзей'
        }
    ]

    public messages: Message[] = []

    public permission: Permission = 'bot.get.friends'

    constructor() {
        super()
    }

    handler({ tg, ctx }: HandlerParams) {
        exec(ctx)
    }
}